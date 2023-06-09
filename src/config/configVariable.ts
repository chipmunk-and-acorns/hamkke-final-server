import * as path from 'path';
import * as dotenv from 'dotenv';

// NODE_ENV에 따라 환경변수 파일을 가져온다.
dotenv.config({
  path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
});

// INFO: 환경변수 key를 받아 값이 있는지 확인하는 함수
const required = (key: string, defaultValue?: any): string => {
  const value = process.env[key] || defaultValue;

  if (value == undefined) {
    throw new Error(`해당 변수를 읽을 수 없습니다 -> "${key}"`);
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
    host: required('DB_HOST'),
    port: Number(required('DB_PORT')),
    username: required('DB_USERNAME'),
    password: required('DB_PASSWORD'),
    database: required('DB_DATABASE'),
  },
  redis: {
    host: required('REDIS_HOST'),
    port: Number(required('REDIS_PORT')),
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
  aws: {
    s3: {
      accessKey: required('AWS_ACCESS_KEY'),
      secretKey: required('AWS_SECRET_KEY'),
      bucket: required('AWS_S3_BUCKET'),
      region: required('AWS_REGION'),
    },
  },
};
