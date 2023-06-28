import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../util/auth';
import config from '../config/configVariable';
import { isEmpty } from 'lodash';
import { findMemberById } from '../repository/member';
import { typeGuard } from '../util/typeGuard';
import redisClient from '../db/redis';

export const authCheck = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorization = request.headers.authorization;
  const accessToken = authorization?.split('Bearer ')[1];

  if (!accessToken) {
    return response.status(401).json({ message: 'token이 없습니다.' });
  }

  try {
    const decoded = verifyToken(accessToken, config.auth.jwt.secretKey);
    if (
      !isEmpty(decoded) &&
      typeGuard<{ memberId: number }>(decoded, 'memberId')
    ) {
      const { memberId } = decoded;
      const findMember = await findMemberById(memberId);

      if (isEmpty(findMember)) {
        return response
          .status(403)
          .json({ message: '유효하지 않은 Token입니다.' });
      }

      const deadTokenValue = await redisClient.get(`dead:${memberId}`);
      if (!isEmpty(deadTokenValue)) {
        return response
          .status(403)
          .json({ message: '유효하지 않은 Token입니다.' });
      }

      response.locals.memberId = memberId;
      return next();
    }

    return response.status(403).json({ message: '유효하지 않은 Token입니다.' });
  } catch (error) {
    if (typeGuard<{ name: string }>(error, 'name')) {
      if (error.name === 'TokenExpiredError') {
        return response.status(403).json({ error });
      } else {
        return response.status(401).json({ error });
      }
    }
  }
};
