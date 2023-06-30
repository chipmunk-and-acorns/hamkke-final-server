import { S3Client } from '@aws-sdk/client-s3';
import envConfig from './configVariable';

export const s3 = new S3Client({
  region: envConfig.aws.s3.region,
  credentials: {
    accessKeyId: envConfig.aws.s3.accessKey,
    secretAccessKey: envConfig.aws.s3.secretKey,
  },
});
