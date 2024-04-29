import * as redis from "redis";

export const redisClientInit = async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });

  await redisClient.connect();
  return redisClient;
};
