import * as express from 'express';

import { authCheck } from '../middleware/auth';
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../controller/comment';
import {
  newCommentValidation,
  updateCommentValidation,
} from '../middleware/validation/comment';

const route = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - commentId
 *         - content
 *         - createdAt
 *         - modifiedAt
 *       properties:
 *         commentId:
 *           type: number
 *           description: 댓글 PK 아이디
 *         member:
 *           $ref: '#/components/schemas/Member'
 *         article:
 *           $ref: '#/components/schemas/Article'
 *         content:
 *           type: string
 *           description: 댓글 내용
 *         createdAt:
 *           type: string
 *           format: date
 *           description: 작성 일자
 *         modifiedAt:
 *           type: string
 *           format: date
 *           description: 수정 일자
 *       example:
 *         commentId: 댓글 PK 아이디
 *         content: 댓글 내용
 *         member: 멤버정보(오브젝트)
 *         article: 게시글정보(오브젝트)
 *         createdAt: Thu Jun 01 2023 00:00:00 GMT+0900 (한국 표준시)
 *         modifiedAt: Mon Jun 05 2023 00:00:00 GMT+0900 (한국 표준시)
 */

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 API
 * /api/comments:
 *   post:
 *     summary: 새 댓글 작성
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: number
 *                 description: 사용자 PK 아이디
 *               article:
 *                 type: number
 *                 description: 게시글 PK 아이디
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
route.post('/', authCheck, newCommentValidation(), createComment);

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 API
 * /api/comments:
 *   get:
 *     summary: 댓글 리스트 조회
 *     tags: [Comment]
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
 *         description: 가져올 댓글 갯수
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 pageInfo:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지
 *                     size:
 *                       type: integer
 *                       description: 페이지당 댓글 갯수
 *                     totalPage:
 *                       type: integer
 *                       description: 총 페이지 수
 *       500:
 *         description: 서버 에러
 */
route.get('/', getComments);

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 API
 * /api/comments/{id}:
 *   patch:
 *     summary: 댓글 내용 수정
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 댓글 PK 아이디
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
route.patch('/:id', authCheck, updateCommentValidation(), updateComment);

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 API
 * /api/comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 댓글 PK 아이디
 *     responses:
 *       204:
 *         description: 댓글 삭제 성공
 *       500:
 *         description: 서버 에러
 */
route.delete('/:id', authCheck, deleteComment);

export default route;
