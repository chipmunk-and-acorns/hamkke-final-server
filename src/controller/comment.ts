import { Request, Response } from 'express';
import { findMemberById } from '../repository/member';
import { findArticleById } from '../repository/article';
import {
  findCommentById,
  findComments,
  removeComment,
  saveComment,
} from '../repository/comment';
import Comment from '../entity/comment';
import { isEmpty } from 'lodash';
import { memberToMemberResponseDto } from '../mapper/member';

export const createComment = async (request: Request, response: Response) => {
  const { memberId } = response.locals;
  const { content, articleId } = request.body;

  try {
    const member = await findMemberById(memberId);
    const article = await findArticleById(articleId);

    if (member && article) {
      const newComment = new Comment();
      newComment.article = article;
      newComment.member = member;
      newComment.content = content;
      const savedComment = await saveComment(newComment);
      const memberResponseDto = memberToMemberResponseDto(savedComment.member);

      return response.status(201).json({
        comment: { ...savedComment, member: { ...memberResponseDto } },
      });
    }

    return response
      .status(400)
      .json({ message: '존재하지 않은 게시글입니다.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

export const getComments = async (request: Request, response: Response) => {
  const { page = 1, size = 10 } = request.query;

  try {
    const relations = ['member'];
    const [comments, count] = await findComments(
      { page: Number(page), size: Number(size) },
      relations,
    );
    const mappedComments = comments.map((comment: Comment) => {
      const memberResponseDto = memberToMemberResponseDto(comment.member);
      return { ...comment, member: memberResponseDto };
    });
    const totalPage = Math.ceil(count / Number(size));
    const pageInfo = {
      currentPage: Number(page),
      size: Number(size),
      totalPage,
      totalCount: count,
    };

    return response.status(200).json({ comments: mappedComments, pageInfo });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

export const updateComment = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { content } = request.body;

  try {
    const comment = await findCommentById(parseInt(id), ['member']);

    if (isEmpty(comment)) {
      return response
        .status(400)
        .json({ message: '찾을 수 없는 게시글입니다.' });
    }

    comment.content = content;
    const updateComment = await saveComment(comment);

    return response.status(200).json({ comment: updateComment });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

export const deleteComment = async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const comment = await findCommentById(parseInt(id));

    if (isEmpty(comment)) {
      return response
        .status(400)
        .json({ message: '존재하지 않는 게시글입니다.' });
    }

    await removeComment(comment);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};
