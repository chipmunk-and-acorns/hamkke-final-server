import { Request, Response } from 'express';
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import { MemberPostDto } from '../../types/member';
import { login, registerAccount } from '../../controller/member';
import Member from '../../entity/member';
import { findMemberByUsername, saveMember } from '../../repository/member';

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
  (findMemberByUsername as jest.Mock) = jest.fn();
  (saveMember as jest.Mock) = jest.fn();
  mockRequest = createRequest();
  mockResponse = createResponse();
});

describe('[Controller] Member - Register', () => {
  test('이메일이 이미 존재하는 경우, 409를 리턴한다.', async () => {
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);

    await registerAccount(mockRequest, mockResponse);

    expect(findMemberByUsername).toBeCalled();
    expect(mockResponse.statusCode).toBe(409);
    expect(mockResponse._getJSONData().message).toBe('이미 존하는 이메일입니다.');
  });

  test('회원가입을 성공하면 201코드와 메세지를 리턴한다.', async () => {
    (findMemberByUsername as jest.Mock).mockReturnValue(null);
    (saveMember as jest.Mock).mockReturnValue(responseMemberMockData);
    const year = postMemberMockData.birth.getFullYear();
    const month = postMemberMockData.birth.getMonth();
    const day = postMemberMockData.birth.getDay();
    mockRequest.body = {
      ...postMemberMockData,
      birth: [year, month, day],
    };

    await registerAccount(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(201);
    expect(mockResponse._getJSONData().memberId).toBe(responseMemberMockData.memberId);
    expect(mockResponse._getJSONData().nickname).toBe(responseMemberMockData.nickname);
  });
});

describe('[Controller] Member - Login', () => {
  test('이메일이 존재하지 않으면 401을 리턴한다.', async () => {
    mockRequest.body = { username: postMemberMockData.username, password: postMemberMockData.password };

    await login(mockRequest, mockResponse);

    expect(findMemberByUsername).toBeCalled();
    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe('이메일 또는 암호가 일치하지 않습니다.');
  });

  test('password가 다르면 401을 리턴한다.', async () => {
    mockRequest.body = { username: postMemberMockData.username, password: faker.internet.password() };
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);

    await login(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(401);
    expect(mockResponse._getJSONData().message).toBe('이메일 또는 암호가 일치하지 않습니다.');
  });

  test('로그인에 성공하면 200코드와 유저정보를 리턴한다.', async () => {
    mockRequest.body = { username: postMemberMockData.username, password: postMemberMockData.password };
    (findMemberByUsername as jest.Mock).mockReturnValue(responseMemberMockData);

    await login(mockRequest, mockResponse);

    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse._getJSONData().memberId).toBe(responseMemberMockData.memberId);
    expect(mockResponse._getJSONData().nickname).toBe(responseMemberMockData.nickname);
  });
});
