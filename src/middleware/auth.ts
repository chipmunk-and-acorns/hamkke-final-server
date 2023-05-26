import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../util/auth';
import config from '../config/configVariable';
import { isEmpty } from 'lodash';
import { findMemberById } from '../repository/member';
import { typeGuard } from '../util/typeGuard';

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

  const decoded = verifyToken(accessToken, config.auth.jwt.secretKey);

  if (typeGuard<{ memberId: number }>(decoded, 'memberId')) {
    const { memberId } = decoded;
    const findMember = await findMemberById(memberId);

    if (isEmpty(findMember)) {
      return response
        .status(403)
        .json({ message: '유효하지 않은 Token입니다.' });
    }

    response.locals.memberId = memberId;
    next();
  }

  return response.status(403).json({ message: '유효하지 않은 Token입니다.' });
};