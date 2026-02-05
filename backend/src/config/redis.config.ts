import Redis from 'ioredis';
import envConfig from './env.config';

const redisClient = new Redis({
  host: envConfig.redis.host,
  port: envConfig.redis.port,
  password: envConfig.redis.password,
  tls: envConfig.redis.host.includes('upstash.io') ? {} : undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redisClient.on('close', () => {
  console.log('Redis connection closed');
});

process.on('SIGINT', async () => {
  await redisClient.quit();
  console.log('Redis connection closed due to app termination');
  process.exit(0);
});

export default redisClient;