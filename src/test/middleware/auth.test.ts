import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';

import {
  MockRequest,
  MockResponse,
  createRequest,
  createResponse,
} from 'node-mocks-http';
import { authCheck } from '../../middleware/auth';
import { verifyToken } from '../../util/auth';
import { findMemberById } from '../../repository/member';

describe('[Middleware] Auth', () => {
  let mockRequest: MockRequest<Request>;
  let mockResponse: MockResponse<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    (verifyToken as jest.Mock) = jest.fn();
    (findMemberById as jest.Mock) = jest.fn();
    mockRequest = createRequest();
    mockResponse = createResponse();
    mockNext = jest.fn();
  });

  test('header에 authorization이 없으면 401을 리턴한다.', async () => {
    await authCheck(mockRequest, mockResponse, mockNext);

    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe('token이 없습니다.');
  });

  test('verify한 token에 정보가 없을때 403을 리턴한다.', async () => {
    mockRequest.headers.authorization = 'Bearer accessToken';

    await authCheck(mockRequest, mockResponse, mockNext);

    expect(verifyToken).toBeCalled();
    expect(mockResponse.statusCode).toBe(403);
    expect(mockResponse._getJSONData().message).toBe(
      '유효하지 않은 Token입니다.',
    );
  });

  test('token정보로 찾은 사용자 정보가 없을때 403을 리턴한다.', async () => {
    const memberId = faker.number.int();
    mockRequest.headers.authorization = 'Bearer accessToken';
    (verifyToken as jest.Mock).mockReturnValue({
      memberId,
    });

    await authCheck(mockRequest, mockResponse, mockNext);

    expect(findMemberById).toBeCalled();
    expect(mockResponse.statusCode).toBe(403);
    expect(mockResponse._getJSONData().message).toBe(
      '유효하지 않은 Token입니다.',
    );
  });
  test('accessToken으로 authCheck를 통과하면 next함수를 호출한다.', async () => {
    const memberId = faker.number.int();
    mockRequest.headers.authorization = 'Bearer accessToken';
    (verifyToken as jest.Mock).mockReturnValue({
      memberId,
    });
    (findMemberById as jest.Mock).mockResolvedValue({ memberId });

    await authCheck(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalled();
    expect(mockResponse.locals.memberId).toBe(memberId);
  });
});
