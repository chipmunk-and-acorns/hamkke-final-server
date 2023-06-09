import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validErrorHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return response.status(400).json({
      errors: result
        .array()
        .map((e) => ({ path: (e as { path: string }).path, message: e.msg })),
    });
  }

  return next();
};
