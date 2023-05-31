import * as path from 'path';
import * as dotenv from 'dotenv';

// NODE_ENV에 따라 환경변수 파일을 가져온다.
dotenv.config({
  path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
});

// INFO: 환경변수 key를 받아 값이 있는지 확인하는 함수
const required = (key: string, defaultValue?: any) => {
  const value = process.env[key] || defaultValue;

  if (value == undefined) {
    throw new Error(`Invalid config variable to "${key}"`);
  }

  return value;
};

// INFO: 미리 환겨변수를 가져와 객체로 관리
export default {
  server: {
    port: Number(required('SERVER_PORT')),
    morgan: required('MORGAN'),
  },
  db: {
    type: required('DB_TYPE'),
    host: required('DB_HOST'),
    port: required('DB_PORT'),
    username: required('DB_USERNAME'),
    password: required('DB_PASSWORD'),
    database: required('DB_DATABASE'),
  },
  redis: {
    deadZoneExpire: Number(required('REDIS_DEAD_EXPIRE')),
  },
  auth: {
    bcrypt: {
      saltRounds: Number(required('BCRYPT_SALT_ROUNDS')),
    },
    jwt: {
      secretKey: required('JWT_SECRET_KEY'),
      refreshKey: required('JWT_REFRESH_KEY'),
      accessExpiresIn: required('JWT_ACCESS_EXPIRES_IN'),
      refreshExpiresIn: required('JWT_REFRESH_EXPIRES_IN'),
    },
  },
};
