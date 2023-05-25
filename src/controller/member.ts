import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import * as MemberRepository from '../repository/member';
import { MemberPostDto } from '../types/member';
import Member from '../entity/member';

/**
 * 회원가입
 */
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

/**
 * 로그인
 */
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

/**
 * 로그아웃
 */
export const logout = async (_request: Request, response: Response) => {
  // TODO: token 제거
  return response.sendStatus(204);
};

/**
 * 비밀번호 변경
 */
export const updatePassword = async (request: Request, response: Response) => {
  const { memberId } = request.params;
  const { password, newPassword } = request.body;
  const findMember = await MemberRepository.findMemberById(parseInt(memberId));
  if (isEmpty(findMember)) {
    return response.status(401).json({ message: '존재하지 않은 사용자입니다.' });
  }

  // TODO: bcrypt 적용후 코드 수정
  if (password !== findMember.password) {
    return response.status(401).json({ message: '비밀번호가 불일치합니다.' });
  }

  if (newPassword === findMember.password) {
    return response.status(401).json({ message: '변경하려는 비밀번호가 이전 비밀번호와 일치합니다.' });
  }

  findMember.password = newPassword;
  MemberRepository.saveMember(findMember);

  return response.status(204);
};

/**
 * 닉네임 변경
 */
export const updateNickname = async (request: Request, response: Response) => {
  const { memberId } = request.params;
  const { nickname } = request.body;
  const findMember = await MemberRepository.findMemberById(parseInt(memberId));
  if (isEmpty(findMember)) {
    return response.status(401).json({ message: '존재하지 않은 사용자입니다.' });
  }

  if (nickname === findMember.nickname) {
    return response.status(401).json({ message: '변경하려는 닉네임이 이전 닉네임과 동일합니다.' });
  }

  findMember.nickname = nickname;
  MemberRepository.saveMember(findMember);

  return response.status(200).json({ nickname });
};

/**
 * 회원탈퇴
 */
export const deleteAccount = async (request: Request, response: Response) => {
  const { memberId } = request.params;
  const findMember = await MemberRepository.findMemberById(parseInt(memberId));
  if (isEmpty(findMember)) {
    return response.status(401).json({ message: '존재하지 않은 사용자입니다.' });
  }

  // TODO: redis에 해당 멤버의 refreshToken 삭제
  await MemberRepository.deleteMemberById(parseInt(memberId));
  return response.sendStatus(204);
};
