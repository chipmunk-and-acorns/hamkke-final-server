import { Request, Response } from 'express';
import { v4 } from 'uuid';
import * as mime from 'mime-types';
import { getSignedUrl } from '../config/aws';

export const preSignImage = async (request: Request, response: Response) => {
  const { contentType } = request.body;

  try {
    const imageKey = `${v4()}.${mime.extension(contentType)}`;
    const key = `image/${imageKey}`;
    const presigned = await getSignedUrl(key);

    return response.status(200).json({ key, presigned });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};
