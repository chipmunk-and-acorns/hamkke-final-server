import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import * as MemberRepository from '../repository/member';
import { MemberPostDto } from '../types/member';
import Member from '../entity/member';

export const registerAccount = async (request: Request, response: Response) => {
  const { username, password, nickname, birth } = request.body;

  const findMember = MemberRepository.findMemberByUsername(username);
  if (!isEmpty(findMember)) {
    return response.status(409).json({ message: '이미 존하는 이메일입니다.' });
  }

  const [year, month, day] = birth;
  const birthDate = new Date(year, month, day);

  // TODO: bcrypt로 비밀번호 암호화 하기

  const postMemberData: MemberPostDto = { username, password, nickname, birth: birthDate };
  const createMember: Member = await MemberRepository.saveMember(postMemberData);

  // TODO: jwt를 이용하여 Token을 발급
  // TODO: refresh Token을 redis에 저장

  return response.status(201).json({ memberId: createMember.memberId, nickname: createMember.nickname });
};

export const login = async (request: Request, response: Response) => {
  const { username, password } = request.body;
  const findMember = await MemberRepository.findMemberByUsername(username);
  const returnUnMatch = () => {
    return response.status(401).json({ message: '이메일 또는 암호가 일치하지 않습니다.' });
  };
  if (isEmpty(findMember)) {
    return returnUnMatch();
  }

  // TODO: bcrypt 적용하였을때 수정할 곳
  if (password !== findMember.password) {
    return returnUnMatch();
  }

  // TODO: accessToken과 refreshToken을 생성
  // TODO: redis에 refreshToken 저장하기
  const { memberId, nickname } = findMember;
  return response.status(200).json({ memberId, nickname });
};

export const logout = async () => {};
export const updateAccount = async () => {};
export const deleteAccount = async () => {};
