import { dataSource } from '../db/db';
import Comment from '../entity/comment';

const repository = dataSource.Comment;

export const saveComment = async (comment: Comment) => {
  return await repository.save(comment);
};

export const findComments = async () => {
  return await repository.find({ relations: ['member'] });
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
