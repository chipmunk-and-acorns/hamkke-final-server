import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

type Payload = { memberId: number };

// bcrypt
export const generateSalt = async (saltRounds: number) =>
  await genSalt(saltRounds);

export const hashPassword = async (saltRounds: number, password: string) => {
  const salt = await generateSalt(saltRounds);
  const hashPassword = await hash(password, salt);

  return hashPassword;
};

export const matchPassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};

// jwt
export const generateToken = (
  payload: Payload,
  secretKey: string,
  expiresIn: string | number,
) => {
  return sign(payload, secretKey, { expiresIn });
};
