import mongoose from 'mongoose';
import Redis from 'ioredis';
import type { Config } from '../config/config';

let redisClient: Redis | null = null;

export async function connectMongo(cfg: Config): Promise<void> {
  await mongoose.connect(cfg.mongodb.uri);
  console.log('Connected to MongoDB');
}

export function getRedis(cfg: Config): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: cfg.redis.host,
      port: cfg.redis.port,
    });
  }
  return redisClient;
}

export async function closeConnections(): Promise<void> {
  await mongoose.disconnect();
  if (redisClient) {
    redisClient.disconnect();
    redisClient = null;
  }
}
