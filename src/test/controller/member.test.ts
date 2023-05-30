import { Request, Response } from 'express';
import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import {
  deleteAccount,
  login,
  logout,
  registerAccount,
  updateNickname,
  updatePassword,
} from '../../controller/member';
import {
  deleteMemberById,
  findMemberById,
  findMemberByUsername,
  saveMember,
} from '../../repository/member';
import { MemberPostDto } from '../../types/member';
import { generateToken, hashPassword, matchPassword } from '../../util/auth';
import Member from '../../entity/member';
import redisClient from '../../db/redis';

let mockRequest: MockRequest<Request>;
let mockResponse: MockResponse<Response>;
const postMemberMockData: MemberPostDto = {
  username: faker.internet.email(),
  password: faker.internet.password(),
  nickname: faker.internet.displayName(),
  birth: faker.date.birthdate(),
};
const responseMemberMockData: Member = {
  ...postMemberMockData,
  memberId: faker.number.int(),
  createdAt: faker.date.anytime(),
  modifiedAt: faker.date.anytime(),
};

beforeEach(() => {
  (findMemberById as jest.Mock) = jest.fn();
  (findMemberByUsername as jest.Mock) = jest.fn();
  (saveMember as jest.Mock) = jest.fn();
  (deleteMemberById as jest.Mock) = jest.fn();
  (hashPassword as jest.Mock) = jest.fn();
  (generateToken as jest.Mock) = jest.fn();
  (matchPassword as jest.Mock) = jest.fn();
  (redisClient.get as jest.Mock) = jest.fn();
  (redisClient.set as jest.Mock) = jest.fn();
  (redisClient.del as jest.Mock) = jest.fn();
  (redisClient.expire as jest.Mock) = jest.fn();
  mockRequest = createRequest();
  mockResponse = createResponse();
});

describe('[Controller] Member - Register', () => {
  test('이메일이 이미 존재하는 경우, 409를 리턴한다.', async () => {
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);

    await registerAccount(mockRequest, mockResponse);

    expect(findMemberByUsername).toBeCalled();
    expect(mockResponse.statusCode).toBe(409);
    expect(mockResponse._getJSONData().message).toBe(
      '이미 존하는 이메일입니다.',
    );
  });

  test('회원가입을 성공하면 201코드와 메세지를 리턴한다.', async () => {
    (findMemberByUsername as jest.Mock).mockReturnValue(null);
    (hashPassword as jest.Mock).mockReturnValue('hashPassword');
    (saveMember as jest.Mock).mockReturnValue(responseMemberMockData);
    (generateToken as jest.Mock).mockReturnValue('tokenValue');
    const year = postMemberMockData.birth.getFullYear();
    const month = postMemberMockData.birth.getMonth();
    const day = postMemberMockData.birth.getDay();
    mockRequest.body = {
      ...postMemberMockData,
      birth: `${year}/${month}/${day}`,
    };

    await registerAccount(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(201);
    expect(mockResponse._getJSONData().memberId).toBe(
      responseMemberMockData.memberId,
    );
    expect(mockResponse._getJSONData().nickname).toBe(
      responseMemberMockData.nickname,
    );
    expect(mockResponse._getJSONData()).toHaveProperty('accessToken');
    expect(mockResponse._getJSONData()).toHaveProperty('refreshToken');
  });
});

describe('[Controller] Member - Login', () => {
  test('이메일이 존재하지 않으면 401을 리턴한다.', async () => {
    mockRequest.body = {
      username: postMemberMockData.username,
      password: postMemberMockData.password,
    };

    await login(mockRequest, mockResponse);

    expect(findMemberByUsername).toBeCalled();
    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '이메일 또는 암호가 일치하지 않습니다.',
    );
  });

  test('password가 다르면 401을 리턴한다.', async () => {
    mockRequest.body = {
      username: postMemberMockData.username,
      password: faker.internet.password(),
    };
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);
    (matchPassword as jest.Mock).mockResolvedValue(false);

    await login(mockRequest, mockResponse);

    expect(matchPassword).toBeCalled();
    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '이메일 또는 암호가 일치하지 않습니다.',
    );
  });

  test('deadzone에 로그인유저 정보가 있을경우 해당 정보를 삭제한다.', async () => {
    mockRequest.body = {
      username: postMemberMockData.username,
      password: postMemberMockData.password,
    };
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);
    (matchPassword as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue('tokenValue');
    (redisClient.get as jest.Mock).mockResolvedValue('dead-user');

    await login(mockRequest, mockResponse);

    expect(redisClient.get).toBeCalled();
    expect(redisClient.del).toBeCalled();
  });

  test('로그인에 성공하면 200코드와 유저정보를 리턴한다.', async () => {
    mockRequest.body = {
      username: postMemberMockData.username,
      password: postMemberMockData.password,
    };
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);
    (matchPassword as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue('tokenValue');

    await login(mockRequest, mockResponse);

    expect(redisClient.del).not.toBeCalled();
    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse._getJSONData().memberId).toBe(
      responseMemberMockData.memberId,
    );
    expect(mockResponse._getJSONData().nickname).toBe(
      responseMemberMockData.nickname,
    );
    expect(mockResponse._getJSONData()).toHaveProperty('accessToken');
    expect(mockResponse._getJSONData()).toHaveProperty('refreshToken');
  });
});

describe('[Controller] Member - Logout', () => {
  test('로그아웃시 deadZone에 accessToken을 추가한다.', async () => {
    mockResponse.locals.memberId = 1;
    await logout(mockRequest, mockResponse);
    expect(redisClient.set).toBeCalled();
    expect(redisClient.del).toBeCalled();
    expect(redisClient.expire).toBeCalled();
  });

  test('로그아웃 성공시 204를 리턴한다.', async () => {
    mockResponse.locals.memberId = 1;
    await logout(mockRequest, mockResponse);

    expect(redisClient.del).toBeCalled();
    expect(mockResponse.statusCode).toBe(204);
  });
});

describe('[Controller] Member - Update Password', () => {
  test('유효하지 않은 memberId일 경우 401을 리턴한다.', async () => {
    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };

    await updatePassword(mockRequest, mockResponse);

    expect(findMemberById).toBeCalled();
    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '존재하지 않은 사용자입니다.',
    );
  });

  test('현재 비밀번호가 일치하지 않을경우 401을 리턴한다.', async () => {
    (findMemberById as jest.Mock).mockReturnValue(responseMemberMockData);
    (matchPassword as jest.Mock).mockResolvedValue(false);
    mockResponse.locals = {
      memberId: responseMemberMockData.memberId.toString(),
    };
    mockRequest.body = {
      password: faker.internet.password(),
      newPassword: faker.internet.password(),
    };

    await updatePassword(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '비밀번호가 불일치합니다.',
    );
  });

  test('새로운 비밀번호와 현재 비밀번호가 같을경우 401을 리턴한다.', async () => {
    (findMemberById as jest.Mock).mockReturnValue(responseMemberMockData);
    (matchPassword as jest.Mock).mockResolvedValueOnce(true);
    (matchPassword as jest.Mock).mockResolvedValueOnce(true);

    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };
    mockRequest.body = {
      password: responseMemberMockData.password,
      newPassword: responseMemberMockData.password,
    };

    await updatePassword(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '변경하려는 비밀번호가 이전 비밀번호와 일치합니다.',
    );
  });

  test('비밀번호가 성공적으로 변경되면 204를 리턴한다.', async () => {
    (findMemberById as jest.Mock).mockReturnValue(responseMemberMockData);
    (matchPassword as jest.Mock).mockResolvedValueOnce(true);
    (matchPassword as jest.Mock).mockResolvedValueOnce(false);
    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };
    mockRequest.body = {
      password: responseMemberMockData.password,
      newPassword: faker.internet.password(),
    };

    await updatePassword(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(204);
    expect(responseMemberMockData.password).not.toBe(mockRequest.body.password);
    expect(responseMemberMockData.password).not.toBe(
      mockRequest.body.newPassword,
    );
  });
});

describe('[Controller] Member - Update Nickname', () => {
  test('유효하지 않은 memberId일 경우 401을 리턴한다.', async () => {
    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };

    await updateNickname(mockRequest, mockResponse);

    expect(findMemberById).toBeCalled();
    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '존재하지 않은 사용자입니다.',
    );
  });

  test('새로운 닉네임과 현재 닉네임이 동일하면 401을 리턴한다.', async () => {
    (findMemberById as jest.Mock).mockReturnValue(responseMemberMockData);
    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };
    mockRequest.body = {
      nickname: responseMemberMockData.nickname,
    };

    await updateNickname(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '변경하려는 닉네임이 이전 닉네임과 동일합니다.',
    );
  });

  test('닉네임을 성공적으로 변경하면 200을 리턴한다.', async () => {
    (findMemberById as jest.Mock).mockReturnValue(responseMemberMockData);
    mockRequest.params = {
      memberId: responseMemberMockData.memberId.toString(),
    };
    mockRequest.body = {
      nickname: faker.internet.userName(),
    };

    await updateNickname(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse._getJSONData().nickname).toBe(
      mockRequest.body.nickname,
    );
    expect(responseMemberMockData.nickname).toBe(mockRequest.body.nickname);
  });
});

describe('[Controller] Member - Delete Member', () => {
  test('유효하지 않은 memberId일 경우 401을 리턴한다.', async () => {
    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };

    await deleteAccount(mockRequest, mockResponse);

    expect(findMemberById).toBeCalled();
    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe(
      '존재하지 않은 사용자입니다.',
    );
  });

  test('회원탈퇴를 성공하면 204를 리턴한다.', async () => {
    (findMemberById as jest.Mock).mockReturnValue(responseMemberMockData);
    mockResponse.locals = {
      memberId: faker.number.int().toString(),
    };

    await deleteAccount(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(204);
  });
});
