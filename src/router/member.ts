import * as express from 'express';

import { registerAccount, login, logout, deleteAccount, updatePassword, updateNickname } from '../controller/member';

const route = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - memberId
 *         - username
 *         - password
 *         - nickname
 *         - birth
 *         - createdAt
 *         - modifiedAt
 *       properties:
 *         memberId:
 *           type: number
 *           description: 사용자 PK 아이디
 *         username:
 *           type: string
 *           description: 로그인 아이디
 *         password:
 *           type: string
 *           description: 비밀번호
 *         nickname:
 *           type: string
 *           description: 닉네임
 *         birth:
 *           type: string
 *           format: date
 *           description: 생일
 *         createdAt:
 *           type: string
 *           format: date
 *           description: 가입 일자
 *         modifiedAt:
 *           type: string
 *           format: date
 *           description: 수정 일자
 *       example:
 *         memberId: 4
 *         username: hamkke@gmail.com
 *         password: 123qwe!1
 *         nickname: hamkke-user
 *         birth: Sun Feb 01 1993 00:00:00 GMT+0900
 *         createdAt: Sun May 05 2023 00:00:00 GMT+0900
 *         modifiedAt: Sun May 24 2023 00:00:00 GMT+0900
 */

/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 사용자 API
 * /api/members/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 로그인 아이디
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *               birth:
 *                 type: array
 *                 items:
 *                   type: number
 *             example:
 *               username: hamkke@gmail.com
 *               password: 123qwe!1
 *               nickname: hamkke
 *               birth: [1993, 11, 9]
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memberId:
 *                   type: number
 *                   description: 사용자 PK 아이디
 *                 nickname:
 *                   type: string
 *                   description: 닉네임
 *               example:
 *                 username: hamkke@gmail.com
 *                 nickname: hamkke
 *       409:
 *         description: 이메일 중복
 */
route.post('/register', registerAccount);
/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 사용자 API
 * /api/members/login:
 *   post:
 *     summary: 로그인
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 로그인 아이디
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *             example:
 *               username: hamkke@gmail.com
 *               password: 123qwe!1
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memberId:
 *                   type: number
 *                   description: 사용자 PK 아이디
 *                 nickname:
 *                   type: string
 *                   description: 닉네임
 *               example:
 *                 username: hamkke@gmail.com
 *                 nickname: hamkke
 *       401:
 *         description: 아이디 혹은 비밀번호가 불일치
 */
route.post('/login', login);
/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 사용자 API
 * /api/members/logout/{memberId}:
 *   post:
 *     summary: 로그아웃
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: number
 *         required: true
 *         description: 멤버 PK 아이디
 *     responses:
 *       204:
 *         description: 로그아웃 성공
 */
route.post('/logout', logout);
/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 사용자 API
 * /api/members/{memberId}/password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: number
 *         required: true
 *         description: 멤버 PK 아이디
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: 이전 비밀번호
 *               newPassword:
 *                 type: string
 *                 description: 새로운 비밀번호
 *             example:
 *               password: 123qwe!1
 *               newPassword: 1q2w3e4r!1
 *     responses:
 *       204:
 *         description: 비밀번호 변경 성공
 *       401:
 *         description: 존재하지 않은 사용자, 현재 비밀번호 불일치, 새로운 비밀번호가 이전비밀번호와 동일
 */
route.patch('/:id/password', updatePassword);
/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 사용자 API
 * /api/members/{memberId}/nickname:
 *   patch:
 *     summary: 닉네임 변경
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: number
 *         required: true
 *         description: 멤버 PK 아이디
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 새로운 닉네임
 *             example:
 *               nickname: chipmunk
 *     responses:
 *       200:
 *         description: 닉네임 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickname:
 *                   type: string
 *                   description: 닉네임
 *               example:
 *                 nickname: chipmunk
 *       401:
 *         description: 존재하지 않은 사용자, 현재 비밀번호 불일치, 새로운 비밀번호가 이전비밀번호와 동일
 */
route.patch('/:id/nickname', updateNickname);
/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 사용자 API
 * /api/members/{memberId}:
 *   delete:
 *     summary: 회원탈퇴
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: number
 *         required: true
 *         description: 멤버 PK 아이디
 *     responses:
 *       204:
 *         description: 회원탈퇴 성공
 *       401:
 *         description: 존재하지 않은 사용자
 */
route.delete('/:id', deleteAccount);

export default route;
