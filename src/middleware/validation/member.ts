import { body } from 'express-validator';
import { validErrorHandler } from './errorHandle';

export const registerValidation = () => [
  body('username').isEmail().withMessage(`아이디는 이메일형식이여야 합니다.`),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/, 'i')
    .withMessage(
      '비밀번호에는 대문자 1개 이상, 숫자 1개 이상, 특수문자 1개 이상 포함해야합니다.',
    )
    .isLength({ min: 6, max: 12 })
    .withMessage('비밀번호는 6글자 이상, 13글자 미만이여야 합니다.')
    .isAscii()
    .withMessage('비밀번호는 영어, 숫자, 특수문자만 포함할 수 있습니다.'),
  body('nickname')
    .isLength({ min: 4, max: 8 })
    .withMessage('닉네임은 4글자 이상 8글자 이하여야 합니다.'),
  body('birth').custom((value) => {
    const birth = value.split('/');
    if (!Array.isArray(birth) || birth.length !== 3) {
      throw new Error(
        'birth 값은 길이가 3인 배열 형태여야 합니다. (예: [year, month, day])',
      );
    }

    const [year, month, day] = birth;
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== +year ||
      date.getMonth() + 1 !== +month ||
      date.getDate() !== +day
    ) {
      throw new Error('유효한 날짜 형식이어야 합니다.');
    }

    return true;
  }),
  validErrorHandler,
];

export const updatePasswordValidation = () => [
  body('newPassword')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/, 'i')
    .withMessage(
      '비밀번호에는 대문자 1개 이상, 숫자 1개 이상, 특수문자 1개 이상 포함해야합니다.',
    )
    .isLength({ min: 6, max: 12 })
    .withMessage('비밀번호는 6글자 이상, 13글자 미만이여야 합니다.')
    .isAscii()
    .withMessage('비밀번호는 영어, 숫자, 특수문자만 포함할 수 있습니다.'),
  validErrorHandler,
];

export const updateNicknameValidation = () => [
  body('nickname')
    .isLength({ min: 4, max: 8 })
    .withMessage('닉네임은 4글자 이상 8글자 이하여야 합니다.'),
  validErrorHandler,
];
