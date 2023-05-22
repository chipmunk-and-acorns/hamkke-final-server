import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`) });

const verify = (key: string, defaultValue?: any) => {
  const value = process.env[key] || defaultValue;

  if (value == undefined) {
    throw new Error(`Invalid config variable to "${key}"`);
  }

  return value;
};

export default {
  server: {
    port: Number(verify('SERVER_PORT')),
  },
  db: {
    type: verify('DB_TYPE'),
    host: verify('DB_HOST'),
    port: verify('DB_PORT'),
    username: verify('DB_USERNAME'),
    password: verify('DB_PASSWORD'),
    database: verify('DB_DATABASE'),
  },
};
