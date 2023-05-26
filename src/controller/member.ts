import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { MemberPostDto } from '../types/member';
import { generateToken, hashPassword, matchPassword } from '../util/auth';
import * as MemberRepository from '../repository/member';
import Member from '../entity/member';
import config from '../config/configVariable';
import redisClient from '../db/redis';

const generateAccessRefreshToken = (payload: { memberId: number }) => {
  const { secretKey, accessExpiresIn, refreshKey, refreshExpiresIn } =
    config.auth.jwt;
  const accessToken = generateToken(payload, secretKey, accessExpiresIn);
  const refreshToken = generateToken(payload, refreshKey, refreshExpiresIn);
  return { accessToken, refreshToken };
};

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
  const hashingPassword = await hashPassword(
    config.auth.bcrypt.saltRounds,
    password,
  );

  const postMemberData: MemberPostDto = {
    username,
    password: hashingPassword,
    nickname,
    birth: birthDate,
  };

  const createMember: Member = await MemberRepository.saveMember(
    postMemberData,
  );
  const payload = {
    memberId: createMember.memberId,
  };

  const { accessToken, refreshToken } = generateAccessRefreshToken(payload);

  await redisClient.set(createMember.memberId.toString(), refreshToken);

  return response.status(201).json({
    memberId: createMember.memberId,
    nickname: createMember.nickname,
    accessToken,
    refreshToken,
  });
};

/**
 * 로그인
 */
export const login = async (request: Request, response: Response) => {
  const { username, password } = request.body;
  const findMember = await MemberRepository.findMemberByUsername(username);
  const returnUnMatch = () => {
    return response
      .status(401)
      .json({ message: '이메일 또는 암호가 일치하지 않습니다.' });
  };

  if (isEmpty(findMember)) {
    return returnUnMatch();
  }

  if (!(await matchPassword(password, findMember.password))) {
    return returnUnMatch();
  }

  const { memberId, nickname } = findMember;
  const payload = { memberId };
  const { accessToken, refreshToken } = generateAccessRefreshToken(payload);

  await redisClient.set(memberId.toString(), refreshToken);

  return response
    .status(200)
    .json({ memberId, nickname, accessToken, refreshToken });
};

/**
 * 로그아웃
 */
export const logout = async (_request: Request, response: Response) => {
  const { memberId } = response.locals;

  await redisClient.del(memberId.toString());

  return response.sendStatus(204);
};

/**
 * 비밀번호 변경
 */
export const updatePassword = async (request: Request, response: Response) => {
  const { memberId } = response.locals;
  const { password, newPassword } = request.body;
  const findMember = await MemberRepository.findMemberById(memberId);
  if (isEmpty(findMember)) {
    return response
      .status(401)
      .json({ message: '존재하지 않은 사용자입니다.' });
  }

  // TODO: bcrypt 적용후 코드 수정
  if (!(await matchPassword(password, findMember.password))) {
    return response.status(401).json({ message: '비밀번호가 불일치합니다.' });
  }

  if (await matchPassword(newPassword, findMember.password)) {
    return response
      .status(401)
      .json({ message: '변경하려는 비밀번호가 이전 비밀번호와 일치합니다.' });
  }

  findMember.password = newPassword;
  MemberRepository.saveMember(findMember);

  return response.status(204);
};

/**
 * 닉네임 변경
 */
export const updateNickname = async (request: Request, response: Response) => {
  const { memberId } = response.locals;
  const { nickname } = request.body;
  const findMember = await MemberRepository.findMemberById(memberId);
  if (isEmpty(findMember)) {
    return response
      .status(401)
      .json({ message: '존재하지 않은 사용자입니다.' });
  }

  if (nickname === findMember.nickname) {
    return response
      .status(401)
      .json({ message: '변경하려는 닉네임이 이전 닉네임과 동일합니다.' });
  }

  findMember.nickname = nickname;
  MemberRepository.saveMember(findMember);

  return response.status(200).json({ nickname });
};

/**
 * 회원탈퇴
 */
export const deleteAccount = async (_request: Request, response: Response) => {
  const { memberId } = response.locals;
  const findMember = await MemberRepository.findMemberById(memberId);
  if (isEmpty(findMember)) {
    return response
      .status(401)
      .json({ message: '존재하지 않은 사용자입니다.' });
  }

  await MemberRepository.deleteMemberById(memberId);
  await redisClient.del(memberId.toString());

  return response.sendStatus(204);
};
