import { Follow } from '../models/follow.model';
import { UserProfile, IUserProfile } from '../models/user-profile.model';

export type ProfileUpdateData = Partial<
  Pick<
    IUserProfile,
    'firstName' | 'lastName' | 'bio' | 'location' | 'skills' | 'languages' | 'website' | 'phone'
  >
>;

export async function upsertProfile(
  userId: string,
  data: ProfileUpdateData
): Promise<IUserProfile> {
  return UserProfile.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, upsert: true, runValidators: true }
  ).lean() as Promise<IUserProfile>;
}

export async function getProfile(userId: string): Promise<IUserProfile | null> {
  return UserProfile.findOne({ userId }).lean();
}

export async function updateAvatar(
  userId: string,
  avatarUrl: string,
  avatarPublicId: string
): Promise<IUserProfile | null> {
  return UserProfile.findOneAndUpdate(
    { userId },
    { $set: { avatarUrl, avatarPublicId } },
    { new: true }
  ).lean();
}

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  const [result] = await Promise.all([
    Follow.create({ followerId, followingId }),
    UserProfile.updateOne({ userId: followerId }, { $inc: { followingCount: 1 } }),
    UserProfile.updateOne({ userId: followingId }, { $inc: { followerCount: 1 } }),
  ]);
  return !!result;
}

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
  const result = await Follow.deleteOne({ followerId, followingId });
  if (result.deletedCount > 0) {
    await Promise.all([
      UserProfile.updateOne({ userId: followerId }, { $inc: { followingCount: -1 } }),
      UserProfile.updateOne({ userId: followingId }, { $inc: { followerCount: -1 } }),
    ]);
    return true;
  }
  return false;
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const doc = await Follow.findOne({ followerId, followingId });
  return !!doc;
}

export async function getFollowers(
  userId: string,
  skip: number,
  limit: number
): Promise<{ rows: string[]; total: number }> {
  const [rows, total] = await Promise.all([
    Follow.find({ followingId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('followerId -_id')
      .lean(),
    Follow.countDocuments({ followingId: userId }),
  ]);
  return {
    rows: rows.map(r => r.followerId as unknown as string),
    total,
  };
}

export async function getFollowing(
  userId: string,
  skip: number,
  limit: number
): Promise<{ rows: string[]; total: number }> {
  const [rows, total] = await Promise.all([
    Follow.find({ followerId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('followerId -_id')
      .lean(),
    Follow.countDocuments({ followerId: userId }),
  ]);
  return {
    rows: rows.map(r => r.followingId as unknown as string),
    total,
  };
}
