import * as aws from 'aws-sdk';
import envConfig from './configVariable';

export const s3 = new aws.S3({
  region: envConfig.aws.s3.region,
  credentials: {
    accessKeyId: envConfig.aws.s3.accessKey,
    secretAccessKey: envConfig.aws.s3.secretKey,
  },
});

export const deleteS3Image = (Key: string) => {
  s3.deleteObject({ Bucket: envConfig.aws.s3.bucket, Key }, (error, _data) => {
    if (error) throw error;
  });
};

export const getSignedUrl = (key: string) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: envConfig.aws.s3.bucket,
        Fields: {
          key,
        },
        Expires: 10,
        Conditions: [
          ['content-length-range', 1, 5 * 1024 * 1024],
          ['starts-with', '$Content-Type', 'image/'],
        ],
      },
      (error, data) => {
        if (error) reject(error);
        resolve(data);
      },
    );
  });
};
