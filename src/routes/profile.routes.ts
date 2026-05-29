import { Router } from 'express';
import type { Config } from '../config/config';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/profile.validator';
import * as controller from '../controllers/profile.controller';

export function profileRoutes(cfg: Config): Router {
  const router = Router();

  router.get('/profile/:userId', controller.getProfile());

  router.patch('/profile', validate(updateProfileSchema), controller.updateProfile());

  router.post('/profile/avatar', controller.uploadAvatar(cfg));

  return router;
}
