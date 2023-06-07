import * as redis from 'redis';
import config from '../config/configVariable';

const redisClientOptions = {
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
};

const redisClient = redis.createClient(redisClientOptions);

redisClient.on('error', (error) => {
  console.error(error);
  throw new Error('redis crack');
});

export default redisClient;
