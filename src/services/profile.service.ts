import * as userRepo from '../repositories/user.repository';

export async function getProfile(
  userId: string
): Promise<Awaited<ReturnType<typeof userRepo.getProfile>> | null> {
  return await userRepo.getProfile(userId);
}

export async function updateProfile(userId: string, data: userRepo.ProfileUpdateData) {
  return await userRepo.upsertProfile(userId, data);
}
