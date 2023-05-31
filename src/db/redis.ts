import * as redis from 'redis';

const redisClient = redis.createClient();

redisClient.on('error', (error) => {
  console.error(error);
  throw new Error('redis crack');
});

export default redisClient;
