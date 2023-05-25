import { faker } from '@faker-js/faker';

import { AppDataSource, dataSource } from '../../db/db';
import { deleteMemberById, findMemberById, findMemberByUsername, saveMember } from '../../repository/member';
import { MemberPostDto } from '../../types/member';
import Member from '../../entity/member';

describe('[Repository] Member', () => {
  const potMemberMockData: MemberPostDto = {
    username: faker.internet.email(),
    password: faker.internet.password(),
    nickname: faker.internet.displayName(),
    birth: faker.date.birthdate(),
  };

  const responseMemberMockData: Member = {
    ...potMemberMockData,
    memberId: faker.number.int(),
    createdAt: faker.date.anytime(),
    modifiedAt: faker.date.anytime(),
  };

  beforeEach(() => {
    AppDataSource.getRepository = jest.fn();
    dataSource.Member.save = jest.fn();
    dataSource.Member.findOneBy = jest.fn();
    dataSource.Member.delete = jest.fn();
  });

  test('[Create] 사용자 정보를 입력받아 정보를 추가할 수 있다.', async () => {
    (dataSource.Member.save as jest.Mock).mockReturnValue(responseMemberMockData);
    const { username, password, nickname, birth } = await saveMember(potMemberMockData);
    const responseData = { username, password, nickname, birth };

    expect(responseData).toEqual(potMemberMockData);
    expect(dataSource.Member.save).toBeCalledWith(potMemberMockData);
  });

  test('[Read] 이메일을 입력받아 해당유저 정보를 찾을수 있다.', async () => {
    (dataSource.Member.findOneBy as jest.Mock).mockReturnValue(responseMemberMockData);
    const mockUsername = responseMemberMockData.username;
    const createMember = await findMemberByUsername(mockUsername);

    expect(createMember?.username).toBe(mockUsername);
    expect(dataSource.Member.findOneBy).toBeCalledWith({ username: mockUsername });
  });

  test('[Read] 유저ID를 입력받아 해당유저 정보를 찾을수 있다.', async () => {
    (dataSource.Member.findOneBy as jest.Mock).mockReturnValue(responseMemberMockData);
    const mockMemberId = responseMemberMockData.memberId;
    const createMember = await findMemberById(mockMemberId);

    expect(createMember?.memberId).toBe(mockMemberId);
    expect(dataSource.Member.findOneBy).toBeCalledWith({ memberId: mockMemberId });
  });

  test('[DELETE] 유저 정보를 삭제할 수 있다.', async () => {
    const mockMemberId = responseMemberMockData.memberId;
    await deleteMemberById(mockMemberId);

    expect(dataSource.Member.delete).toBeCalledWith({ memberId: mockMemberId });
  });
});
