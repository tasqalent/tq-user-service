import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, success, errorResponse, ERROR_CODES } from '@tasqalent/shared';
import * as profileService from '../services/profile.service';

export function getProfile() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await profileService.getProfile(req.params.userId);
      if (!profile) {
        errorResponse(res, ERROR_CODES.NOT_FOUND, 'Profile not found', HTTP_STATUS.NOT_FOUND);
        return;
      }
      success(res, profile);
    } catch (err) {
      next(err);
    }
  };
}

export function updateProfile() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const profile = await profileService.updateProfile(userId, req.body);
      success(res, profile);
    } catch (err) {
      next(err);
    }
  };
}
