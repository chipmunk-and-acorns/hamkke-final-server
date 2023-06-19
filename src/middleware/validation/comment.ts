import { body } from 'express-validator';

export const newCommentValidation = () => [
  body('articleId')
    .notEmpty()
    .isInt()
    .withMessage('유효하지 않은 게시글 아이디입니다.'),
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('댓글은 1자이상 1000자이하로 작성합니다.'),
];

export const updateCommentValidation = () => [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('댓글은 1자이상 1000자이하로 작성합니다.'),
];
