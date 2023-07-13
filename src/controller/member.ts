import { Request, Response } from 'express';
import axios from 'axios';
import { isEmpty } from 'lodash';

import Member from '../entity/member';
import config from '../config/configVariable';
import redisClient from '../db/redis';
import * as MemberRepository from '../repository/member';
import { MemberPostDto } from '../types/member';
import { memberToMemberResponseDto } from '../mapper/member';
import { generateToken, hashPassword, matchPassword } from '../util/auth';

type DataType = 'articles' | 'comments';

const generateAccessRefreshToken = (payload: { memberId: number }) => {
  const { secretKey, accessExpiresIn, refreshKey, refreshExpiresIn } =
    config.auth.jwt;
  const accessToken = generateToken(payload, secretKey, accessExpiresIn);
  const refreshToken = generateToken(payload, refreshKey, refreshExpiresIn);

  return { accessToken, refreshToken };
};

const getGoogleAuthURL = () => {
  let url = config.oAuth.google.authURL;
  url += `?client_id=${config.oAuth.google.clientId}`;
  url += `&redirect_uri=${config.oAuth.google.redirectURL}`;
  url += `&access_type=offline`;
  url += `&response_type=code`;
  url += `&prompt=consent`;
  url += `&scope=email profile openid`;

  return url;
};

// 회원가입
export const registerAccount = async (request: Request, response: Response) => {
  const { username, password, nickname, birth } = request.body;

  try {
    const findMember = await MemberRepository.findMemberByUsername(username);

    if (!isEmpty(findMember)) {
      return response
        .status(409)
        .json({ message: '이미 존하는 이메일입니다.' });
    }
    const [year, month, day] = birth.split('/');
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
      accessToken: `Bearer ${accessToken}`,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

// 로그인
export const login = async (request: Request, response: Response) => {
  try {
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

    const isMatch = await matchPassword(password, findMember.password);

    if (!isMatch) {
      return returnUnMatch();
    }

    const { memberId, nickname } = findMember;
    const payload = { memberId };
    const { accessToken, refreshToken } = generateAccessRefreshToken(payload);

    const findDeadZoneInfo = await redisClient.get(`dead:${memberId}`);

    if (findDeadZoneInfo != null) {
      await redisClient.del(`dead:${memberId}`);
    }

    await redisClient.set(memberId.toString(), refreshToken);

    return response.status(200).json({
      memberId,
      nickname,
      accessToken: `Bearer ${accessToken}`,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

// Google 로그인 Redirect
export const oAuthGoogle = async (_request: Request, response: Response) => {
  const url = getGoogleAuthURL();
  return response.redirect(url);
};

// OAuth 로그인 성공
export const oAuthSuccess = async (request: Request, response: Response) => {
  // const { authorization } = request.headers;
  const { code } = request.query;
  try {
    const {
      data: { access_token },
    } = await axios.post(
      config.oAuth.google.tokenURL,
      {
        code,
        client_id: config.oAuth.google.clientId,
        client_secret: config.oAuth.google.clientSecret,
        redirect_uri: config.oAuth.google.redirectURL,
        grant_type: 'authorization_code',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { data: userData } = await axios.get(
      config.oAuth.google.userInfoURL,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const { email, name, picture } = userData;
    const findMember = await MemberRepository.findMemberByUsername(email);

    if (isEmpty(findMember)) {
      return response.status(200).json({ email, name, profile: picture });
    }

    const { memberId, nickname } = findMember;
    const payload = { memberId };
    const { accessToken, refreshToken } = generateAccessRefreshToken(payload);

    const findDeadZoneInfo = await redisClient.get(`dead:${memberId}`);

    if (findDeadZoneInfo != null) {
      await redisClient.del(`dead:${memberId}`);
    }

    await redisClient.set(memberId.toString(), refreshToken);

    return response.status(200).json({
      memberId,
      nickname,
      accessToken: `Bearer ${accessToken}`,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'OAuth Error', error });
  }
};

// 로그아웃
export const logout = async (_request: Request, response: Response) => {
  try {
    const { memberId } = response.locals;

    await redisClient.del(memberId.toString());
    await redisClient.set(`dead:${memberId}`, 'logout-member');
    await redisClient.expire(`dead:${memberId}`, config.redis.deadZoneExpire);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

// 비밀번호 변경
export const updatePassword = async (request: Request, response: Response) => {
  try {
    const { memberId } = response.locals;
    const { password, newPassword } = request.body;
    const findMember = await MemberRepository.findMemberById(memberId);
    if (isEmpty(findMember)) {
      return response
        .status(401)
        .json({ message: '존재하지 않은 사용자입니다.' });
    }

    if (!(await matchPassword(password, findMember.password))) {
      return response.status(401).json({ message: '비밀번호가 불일치합니다.' });
    }

    if (await matchPassword(newPassword, findMember.password)) {
      return response
        .status(401)
        .json({ message: '변경하려는 비밀번호가 이전 비밀번호와 일치합니다.' });
    }

    findMember.password = await hashPassword(
      config.auth.bcrypt.saltRounds,
      newPassword,
    );
    await MemberRepository.saveMember(findMember);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

// 닉네임 변경
export const updateNickname = async (request: Request, response: Response) => {
  try {
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
    await MemberRepository.saveMember(findMember);

    return response.status(200).json({ nickname });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const updateProfile = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { profile } = request.body;

  try {
    const member = await MemberRepository.findMemberById(Number(id));

    if (isEmpty(member)) {
      return response
        .status(400)
        .json({ message: '존재하지 않은 사용자입니다.' });
    }

    member.profile = profile;

    const updateProfile = await MemberRepository.saveMember(member);
    const responseMemberDto = await memberToMemberResponseDto(updateProfile);

    return response.status(200).json({ member: responseMemberDto });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

// 회원탈퇴
export const deleteAccount = async (_request: Request, response: Response) => {
  try {
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
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getArticlesOrCommentsByMember = async (
  request: Request,
  response: Response,
) => {
  const { id, type } = request.params;
  if (['comments', 'articles'].includes(type)) {
    try {
      const findMember = await MemberRepository.findMemberById(Number(id), [
        type,
      ]);

      if (isEmpty(findMember)) {
        return response
          .status(400)
          .json({ message: '존재하지 않은 사용자 아이디입니다.' });
      }
      const data = findMember[type as DataType];

      return response.status(200).json({ [type]: data });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error });
    }
  } else {
    return response.status(404).json({ message: 'Not Found' });
  }
};
