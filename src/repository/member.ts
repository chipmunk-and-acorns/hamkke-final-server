import { dataSource } from '../db/db';
import Member from '../entity/member';
import { MemberPostDto } from '../types/member';

const repository = dataSource.Member;

export const saveMember = async (member: MemberPostDto | Member) => {
  return await repository.save(member);
};

export const findMemberByUsername = async (username: string) => {
  return await repository.findOneBy({ username });
};

export const findMemberById = async (memberId: number) => {
  return await repository.findOneBy({ memberId });
};

export const deleteMemberById = async (memberId: number) => {
  return await repository.delete({ memberId });
};
