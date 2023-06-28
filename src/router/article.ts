import * as express from 'express';
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  completeArticle,
} from '../controller/article';

import { authCheck } from '../middleware/auth';
import { articleValidation } from '../middleware/validation/article';

const route = express.Router();

// TODO: Stack과 Position 만들면, 해당 속성 추가해야함
/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - articleId
 *         - title
 *         - content
 *         - category
 *         - proceed
 *         - dueDate
 *         - contact
 *         - link
 *         - createdAt
 *         - modifiedAt
 *       properties:
 *         articleId:
 *           type: number
 *           description: 게시글 PK 아이디
 *         title:
 *           type: string
 *           description: 게시글 제목
 *         content:
 *           type: string
 *           description: 본문 내용
 *         category:
 *           type: string
 *           enum: [study, project]
 *           description: 게시글 카테고리
 *         recruitCount:
 *           type: number
 *           description: 모집 인원
 *         proceed:
 *           type: string
 *           enum: [online, offline]
 *           description: 진행 방식
 *         period:
 *           type: number
 *           description: 진행 기간
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: 모집 마감일
 *         contact:
 *           type: string
 *           enum: [kakao, email, google]
 *           description: 연락 방법
 *         link:
 *           type: string
 *           description: 연락 링크
 *         complete:
 *           type: boolean
 *           description: 모집 마감 유무
 *         member:
 *           $ref: '#/components/schemas/Member'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         createdAt:
 *           type: string
 *           format: date
 *           description: 작성 일자
 *         modifiedAt:
 *           type: string
 *           format: date
 *           description: 수정 일자
 *       example:
 *         articleId: 3
 *         title: study node.js
 *         content: learn nodejs document
 *         category: study
 *         recruitCount: 3
 *         proceed: online
 *         period: 2
 *         dueDate: Mon Jun 19 2023 14:50:32 GMT+0900 (한국 표준시)
 *         contact: kakao
 *         link: http://shalashala.com
 *         complete: true
 *         member: 유저정보(오브젝트)
 *         comments: 댓글정보(배열)
 *         createdAt: Thu Jun 01 2023 00:00:00 GMT+0900 (한국 표준시)
 *         modifiedAt: Mon Jun 05 2023 00:00:00 GMT+0900 (한국 표준시)
 */

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 API
 * /api/articles:
 *   post:
 *     summary: 새 글 작성
 *     tags: [Article]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 본문 내용
 *               category:
 *                 type: string
 *                 enum: [study, project]
 *                 description: 게시글 카테고리
 *               recruitCount:
 *                 type: number
 *                 description: 모집 인원
 *               proceed:
 *                 type: string
 *                 enum: [online, offline]
 *                 description: 진행 방식
 *               period:
 *                 type: number
 *                 description: 진행 기간
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: 모집 마감일
 *               contact:
 *                 type: string
 *                 enum: [kakao, email, google]
 *                 description: 연락 방법
 *               link:
 *                 type: string
 *                 description: 연락 링크
 *     responses:
 *       200:
 *         description: 게시글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: 서버 에러
 */
route.post('/', authCheck, articleValidation(), createArticle);
/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 API
 * /api/articles:
 *   get:
 *     summary: 게시글 리스트 가져오기
 *     tags: [Article]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 현재 페이지
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: 가져올 게시글 갯수
 *       - in: query
 *         name: stacks
 *         schema:
 *           type: array
 *         description: 기술 스택 필터 (stackId[] | undefined)
 *       - in: query
 *         name: position
 *         schema:
 *           type: integer
 *         description: 포지션 필터 (positionId | undefined)
 *       - in: query
 *         name: complete
 *         schema:
 *           type: boolean
 *         description: 모집 완료 필터 (true | undefined)
 *     responses:
 *       200:
 *         description: 게시글 리스트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 pageInfo:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: 현재 페이지
 *                     size:
 *                       type: integer
 *                       description: 페이지당 게시글 갯수
 *                     totalPage:
 *                       type: integer
 *                       description: 총 페이지 수
 *                     totalCount:
 *                       type: integer
 *                       description: 총 게시글 수
 *       500:
 *         description: 서버 에러
 */
route.get('/', getArticles);
/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 API
 * /api/articles/{id}:
 *   get:
 *     summary: 단일 게시글 가져오기
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 게시글 PK 아이디
 *     responses:
 *       200:
 *         description: 게시글 단일 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       500:
 *         description: 서버 에러
 */
route.get('/:id', getArticle);
// route.get('/member/:id', getArticlesByMemberId);
/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 API
 * /api/articles/{id}:
 *   put:
 *     summary: 게시글 수정
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 게시글 PK 아이디
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 본문 내용
 *               category:
 *                 type: string
 *                 enum: [study, project]
 *                 description: 게시글 카테고리
 *               recruitCount:
 *                 type: number
 *                 description: 모집 인원
 *               proceed:
 *                 type: string
 *                 enum: [online, offline]
 *                 description: 진행 방식
 *               period:
 *                 type: number
 *                 description: 진행 기간
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: 모집 마감일
 *               contact:
 *                 type: string
 *                 enum: [kakao, email, google]
 *                 description: 연락 방법
 *               link:
 *                 type: string
 *                 description: 연락 링크
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: 서버 에러
 */
route.put('/:id', authCheck, articleValidation(), updateArticle);
/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 API
 * /api/articles/{id}:
 *   patch:
 *     summary: 게시글 모집 완료
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 게시글 PK 아이디
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complete:
 *                 type: boolean
 *                 description: 모집 마감 유무
 *     responses:
 *       200:
 *         description: 게시글 모집 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: 서버 에러
 */
route.patch('/:id', authCheck, articleValidation(), completeArticle);
/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 API
 * /api/articles/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 게시글 PK 아이디
 *     responses:
 *       204:
 *         description: 게시글 삭제 성공
 *       500:
 *         description: 서버 에러
 */
route.delete('/:id', authCheck, deleteArticle);

export default route;
