import { v2 as cloudinaryV2 } from 'cloudinary';
import type { Config } from '../config/config';
import * as userRepo from '../repositories/user.repository';
import { buildProfileImagePublicId, getSkip, getTotalPages } from '@tasqalent/shared';

export async function getProfile(
  userId: string
): Promise<Awaited<ReturnType<typeof userRepo.getProfile>> | null> {
  return await userRepo.getProfile(userId);
}

export async function updateProfile(userId: string, data: userRepo.ProfileUpdateData) {
  return await userRepo.upsertProfile(userId, data);
}

export async function updateAvatar(cfg: Config, userId: string, filePath: string) {
  cloudinaryV2.config({
    cloud_name: cfg.cloudinary.cloudName,
    api_key: cfg.cloudinary.apiKey,
    api_secret: cfg.cloudinary.apiSecret,
  });

  const publicId = buildProfileImagePublicId(userId);
  const result = await cloudinaryV2.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  });

  const profile = await userRepo.updateAvatar(userId, result.secure_url, result.public_id);

  return profile;
}

export async function follow(followerId: string, followingId: string) {
  const already = await userRepo.isFollowing(followerId, followingId);
  if (already) {
    throw Object.assign(new Error('Already following this user'), { code: 'CONFLICT' });
  }
  if (followerId === followingId) {
    throw Object.assign(new Error('Cannot follow yourself'), { code: 'VALIDATION' });
  }

  await userRepo.followUser(followerId, followingId);

  return { following: true };
}

export async function unfollow(followerId: string, followingId: string) {
  const result = await userRepo.unfollowUser(followerId, followingId);
  if (!result) {
    throw Object.assign(new Error('Not following this user'), { code: 'NOT_FOUND' });
  }

  return { following: false };
}

export async function getFollowersList(userId: string, page: number, limit: number) {
  const skip = getSkip(page, limit);
  const { rows: followerIds, total } = await userRepo.getFollowers(userId, skip, limit);
  const totalPages = getTotalPages(total, limit);

  const profiles = await Promise.all(followerIds.map(id => getProfile(id)));

  return { data: profiles.filter(Boolean), meta: { page, limit, total, totalPages } };
}

export async function getFollowingList(userId: string, page: number, limit: number) {
  const skip = getSkip(page, limit);
  const { rows: followingIds, total } = await userRepo.getFollowing(userId, skip, limit);
  const totalPages = getTotalPages(total, limit);

  const profiles = await Promise.all(followingIds.map(id => getProfile(id)));

  return { data: profiles.filter(Boolean), meta: { page, limit, total, totalPages } };
}
