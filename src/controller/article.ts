import { Request, Response } from 'express';
import { assignIn, isEmpty } from 'lodash';

import Stack from '../entity/stack';
import Member from '../entity/member';
import Article from '../entity/article';
import Position from '../entity/position';
import { findStackById } from '../repository/stack';
import { findMemberById } from '../repository/member';
import { findPositionById } from '../repository/position';
import {
  findArticleById,
  findArticles,
  removeArticle,
  saveArticle,
} from '../repository/article';
import { memberToMemberResponseDto } from '../mapper/member';

// create
export const createArticle = async (request: Request, response: Response) => {
  const {
    title,
    content,
    category,
    recruitCount,
    proceed,
    period,
    dueDate,
    contact,
    link,
    stacks,
    positions,
  } = request.body;
  const { memberId } = response.locals;

  try {
    const member = await findMemberById(memberId);
    const newArticle = new Article();
    newArticle.title = title;
    newArticle.content = content;
    newArticle.category = category;
    newArticle.recruitCount = recruitCount;
    newArticle.proceed = proceed;
    newArticle.period = period;
    newArticle.dueDate = dueDate;
    newArticle.contact = contact;
    newArticle.link = link;
    newArticle.member = member as Member;

    const findStacks: Stack[] = [];
    const findPositions: Position[] = [];

    for (const stackId of stacks || []) {
      const stack = await findStackById(stackId);

      if (isEmpty(stack)) {
        continue;
      }

      findStacks.push(stack);
    }

    for (const positionId of positions || []) {
      const position = await findPositionById(positionId);

      if (isEmpty(position)) {
        continue;
      }

      findPositions.push(position);
    }

    newArticle.stacks = findStacks;
    newArticle.positions = findPositions;

    const createdArticle = await saveArticle(newArticle);

    return response.status(200).json({ article: createdArticle });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

// read
export const getArticles = async (request: Request, response: Response) => {
  const {
    page = 1,
    size = 10,
    stacks = [],
    position,
    complete,
  } = request.query;

  try {
    const [articles, count] = await findArticles({
      page: Number(page),
      size: Number(size),
      stacks: (stacks as string[]).map((s: string) => Number(s)),
      position: Number(position),
      complete: complete === 'true',
    });

    const totalPage = Math.ceil(count / Number(size));

    return response.status(200).json({
      articles,
      pageInfo: {
        currentPage: Number(page),
        size: Number(size),
        totalPage,
        totalCount: count,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

// readOne
export const getArticle = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const article = await findArticleById(parseInt(id), ['member', 'comments']);

    if (isEmpty(article)) {
      return response
        .status(400)
        .json({ message: '잘못된 게시글 아이디입니다.' });
    }

    const memberResponseDto = memberToMemberResponseDto(article.member);

    return response
      .status(200)
      .json({ article: { ...article, member: { ...memberResponseDto } } });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

// update
export const updateArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { memberId } = response.locals;
  const {
    title,
    content,
    category,
    recruitCount,
    proceed,
    period,
    dueDate,
    contact,
    link,
    stacks = [],
    positions = [],
  } = request.body;
  try {
    const findArticle = await findArticleById(parseInt(id), ['member']);

    if (isEmpty(findArticle)) {
      return response
        .status(400)
        .json({ message: '존재하지 않은 게시글 ID입니다.' });
    }

    if (findArticle.member.memberId !== parseInt(memberId)) {
      return response
        .status(401)
        .json({ message: '게시글 수정 권한이 없습니다.' });
    }

    const updateStacks = await Promise.all(
      stacks.map(async (stackId: number) => await findStackById(stackId)),
    );
    const updatePositions = await Promise.all(
      positions.map(
        async (positionId: number) => await findPositionById(positionId),
      ),
    );

    const updateData = assignIn(findArticle, {
      title,
      content,
      category,
      recruitCount,
      proceed,
      period,
      dueDate,
      contact,
      link,
      stacks: updateStacks,
      positions: updatePositions,
    });
    const updatedArticle = await saveArticle(updateData);

    return response.status(200).json({ article: updatedArticle });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

export const completeArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { complete } = request.body;
  const { memberId } = response.locals;

  try {
    const findArticle = await findArticleById(parseInt(id), ['member']);

    if (isEmpty(findArticle)) {
      return response
        .status(400)
        .json({ message: '존재하지 않은 게시글 ID입니다.' });
    }

    if (findArticle.member.memberId !== parseInt(memberId)) {
      return response
        .status(401)
        .json({ message: '게시글 수정 권한이 없습니다.' });
    }

    findArticle.complete = complete;
    const completeUpdateArticle = await saveArticle(findArticle);

    return response.status(200).json({ article: completeUpdateArticle });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};

// delete
export const deleteArticle = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { memberId } = response.locals;
  try {
    const findArticle = await findArticleById(parseInt(id), ['member']);

    if (isEmpty(findArticle)) {
      return response.status(400).json({ message: '존재하지 않는 ID입니다.' });
    }

    if (findArticle.member.memberId !== parseInt(memberId)) {
      return response
        .status(401)
        .json({ message: '게시글 삭제권한이 없습니다.' });
    }

    await removeArticle(findArticle);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: '에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  }
};
