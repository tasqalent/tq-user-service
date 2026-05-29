import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { Config } from './config/config';
import { createLogger, requestIdMiddleware, errorMiddleware } from '@tasqalent/shared';
import { connectMongo } from './db/connection';

export async function createApp(cfg: Config) {
  createLogger({ serviceName: cfg.serviceName, level: cfg.logLevel });

  await connectMongo(cfg);

  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet({ hsts: false }));

  app.use(express.json({ limit: '1mb' }));

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  app.use(requestIdMiddleware);

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(errorMiddleware);

  return { app };
}
