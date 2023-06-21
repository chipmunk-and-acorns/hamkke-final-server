import { body } from 'express-validator';
import {
  ArticleCategory,
  ArticleContact,
  ArticleProceed,
} from '../../entity/common/Enums';
import { validErrorHandler } from './errorHandle';

export const articleValidation = () => [
  body('title')
    .isLength({ min: 1, max: 1000 })
    .withMessage('제목은 1자 이상 1000자 이하로 작성합니다.'),
  body('content')
    .isLength({ min: 1, max: 5000 })
    .withMessage('본문은 1자 이상 5000자 이하로 작성합니다.'),
  body('category')
    .custom((value: any) => Object.values(ArticleCategory).includes(value))
    .withMessage('잘못된 카테고리 입니다.'),
  body('recruitCount')
    .custom((value: any) => value === null || typeof value === 'number')
    .withMessage('모집인원은 null 또는 숫자만 입력가능합니다.'),
  body('proceed')
    .custom((value: any) => Object.values(ArticleProceed).includes(value))
    .withMessage('잘못된 진행방식 입니다.'),
  body('period')
    .custom((value: any) => value === null || typeof value === 'number')
    .withMessage('진행기간은 null 또는 숫자만 입력가능합니다.'),
  body('dueDate').isISO8601().withMessage('유효하지 않은 날짜형식입니다.'),
  body('contact')
    .custom((value: any) => Object.values(ArticleContact).includes(value))
    .withMessage('잘못된 연락 방법입니다.'),
  body('link').trim().notEmpty().withMessage('연락 링크가 비어있습니다.'),
  validErrorHandler,
];
