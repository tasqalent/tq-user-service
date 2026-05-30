import { Router } from 'express';
import type { Config } from '../config/config';
import { profileRoutes } from './profile.routes';

export function routes(cfg: Config): Router {
  const router = Router();
  router.use('/', profileRoutes(cfg));
  return router;
}
