import { Router } from 'express';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/profile.validator';
import * as controller from '../controllers/profile.controller';

export function profileRoutes(): Router {
  const router = Router();

  router.get('/profile/:userId', controller.getProfile());

  router.patch('/profile', validate(updateProfileSchema), controller.updateProfile());

  return router;
}
