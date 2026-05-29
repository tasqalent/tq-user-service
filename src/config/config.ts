import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  serviceName: string;
  port: number;
  logLevel: string;
  mongodb: {
    uri: string;
  };
  redis: {
    host: string;
    port: number;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  jwt: {
    secret: string;
  };
  cache: {
    profileTtlSeconds: number;
  };
}

export function load(): Config {
  return {
    serviceName: process.env.SERVICE_NAME ?? 'tq-user-service',
    port: Number(process.env.PORT) || 3002,
    logLevel: process.env.LOG_LEVEL ?? 'INFO',
    mongodb: {
      uri: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/tq_users',
    },
    redis: {
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
      apiKey: process.env.CLOUDINARY_API_KEY ?? '',
      apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    },
    cache: {
      profileTtlSeconds: Number(process.env.PROFILE_CACHE_TTL) || 300,
    },
  };
}
