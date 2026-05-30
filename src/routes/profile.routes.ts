import { Router } from 'express';
import type { Config } from '../config/config';
import { requireAuth } from '@tasqalent/shared';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/profile.validator';
import * as controller from '../controllers/profile.controller';

export function profileRoutes(cfg: Config): Router {
  const router = Router();

  router.get('/profile/:userId', controller.getProfile(cfg));
  router.get('/profile/:userId/followers', controller.getFollowers(cfg));
  router.get('/profile/:userId/following', controller.getFollowing(cfg));

  router.use(requireAuth(cfg.jwt.secret));

  router.patch('/profile', validate(updateProfileSchema), controller.updateProfile(cfg));
  router.post('/profile/avatar', controller.uploadAvatar(cfg));

  router.post('/profile/:userId/follow', controller.followUser(cfg));
  router.delete('/profile/:userId/follow', controller.unfollowUser(cfg));

  return router;
}
