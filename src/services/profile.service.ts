import { v2 as cloudinaryV2 } from 'cloudinary';
import type { Config } from '../config/config';
import * as userRepo from '../repositories/user.repository';
import { buildProfileImagePublicId } from '@tasqalent/shared';

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
