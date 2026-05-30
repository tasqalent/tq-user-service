import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, success, errorResponse, ERROR_CODES } from '@tasqalent/shared';
import type { Config } from '../config/config';
import * as profileService from '../services/profile.service';
import { parsePagination } from '@tasqalent/shared';

export function getProfile(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await profileService.getProfileOrCache(cfg, req.params.userId as string);
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

export function updateProfile(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.sub as string;
      const profile = await profileService.updateProfile(cfg, userId, req.body);
      success(res, profile);
    } catch (err) {
      next(err);
    }
  };
}

export function uploadAvatar(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.sub as string;
      const profile = await profileService.updateAvatar(cfg, userId, req.body.filePath);
      success(res, profile);
    } catch (err) {
      next(err);
    }
  };
}

export function followUser(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const followerId = req.user?.sub as string;
      const followingId = req.params.userId as string;
      const result = await profileService.follow(cfg, followerId, followingId);
      success(res, result);
    } catch (err) {
      const e = err as { code?: string; message: string };
      if (e.code === 'CONFLICT') {
        errorResponse(res, ERROR_CODES.CONFLICT, e.message, HTTP_STATUS.CONFLICT);
        return;
      }
      next(err);
    }
  };
}

export function unfollowUser(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const followerId = req.user?.sub as string;
      const followingId = req.params.userId as string;
      const result = await profileService.unfollow(cfg, followerId, followingId);
      success(res, result);
    } catch (err) {
      const e = err as { code?: string; message: string };
      if (e.code === 'NOT_FOUND') {
        errorResponse(res, ERROR_CODES.NOT_FOUND, e.message, HTTP_STATUS.NOT_FOUND);
        return;
      }
      next(err);
    }
  };
}

export function getFollowers(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit } = parsePagination(req.query as Record<string, unknown>);
      const result = await profileService.getFollowersList(
        cfg,
        req.params.userId as string,
        page,
        limit
      );
      success(res, result);
    } catch (err) {
      next(err);
    }
  };
}

export function getFollowing(cfg: Config) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit } = parsePagination(req.query as Record<string, unknown>);
      const result = await profileService.getFollowingList(
        cfg,
        req.params.userId as string,
        page,
        limit
      );
      success(res, result);
    } catch (err) {
      next(err);
    }
  };
}
