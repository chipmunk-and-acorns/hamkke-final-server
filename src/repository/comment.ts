import { dataSource } from '../db/db';
import Comment from '../entity/comment';
import { PageInfo } from '../types/page';

const repository = dataSource.Comment;

export const saveComment = async (comment: Comment) => {
  return await repository.save(comment);
};

export const findComments = async (pageInfo: PageInfo, relations: string[]) => {
  const { page, size } = pageInfo;
  return await repository.findAndCount({
    take: page,
    skip: (page - 1) * size,
    relations,
  });
};

export const findCommentById = async (
  commentId: number,
  relations: string[] = [],
) => {
  return await repository.findOne({ where: { commentId }, relations });
};

export const removeComment = async (comment: Comment) => {
  await repository.remove(comment);
};
