import { Request, Response } from 'express';
import Stack from '../entity/stack';
import { findPositionById } from '../repository/position';
import Position from '../entity/position';
import { saveStack } from '../repository/stack';

interface S3File extends Express.Multer.File {
  key: string;
}

export const createStack = async (request: Request, response: Response) => {
  const { key } = request.file as S3File;
  const { name, positions = [] } = request.body;

  try {
    const positionData: Position[] = await Promise.all(
      positions.map(async (id: string) => {
        return await findPositionById(Number(id));
      }),
    );

    const stack = new Stack();
    stack.name = name;
    stack.profile = key;
    stack.positions = positionData;

    const createdStack = await saveStack(stack);

    return response.status(201).json({ stack: createdStack });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }

  return response.json({});
};
/* 
export const getStackList = async (request: Request, response: Response) => {};

export const getStack = async (request: Request, response: Response) => {};

export const updateStack = async (request: Request, response: Response) => {};

export const updateStackImage = async (
  request: Request,
  response: Response,
) => {};

export const deleteStack = async (request: Request, response: Response) => {};
 */
