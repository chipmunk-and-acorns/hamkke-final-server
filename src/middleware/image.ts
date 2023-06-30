import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as mime from 'mime-types';
import { v4 } from 'uuid';
import { s3 } from '../config/aws';
import envConfig from '../config/configVariable';

const storage = multerS3({
  s3: s3,
  bucket: envConfig.aws.s3.bucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  contentDisposition: 'inline',
  key: (_req, file, cb) =>
    cb(null, `stack/${v4()}.${mime.extension(file.mimetype)}`),
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    console.log(file);
    ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'].includes(
      file.mimetype,
    )
      ? cb(null, true)
      : cb(new Error('지원하는 파일형식이 아닙니다.'));
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
