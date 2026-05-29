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
