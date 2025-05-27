import { RedisPubSub } from 'graphql-redis-subscriptions';

const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

export const pubsub = new RedisPubSub({
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (retryCount) => {
      if (retryCount > 10) return null;
      return Math.min(retryCount * 50, 3000);
    },
  },
});

export const redisSubscriber = pubsub.getSubscriber();
export const redisPublisher = pubsub.getPublisher();
