import Member from '../entity/member';

export const memberToMemberReponseDto = (member: Member) => {
  const { memberId, username, nickname, birth, profile } = member;
  return { memberId, username, nickname, birth, profile };
};
