import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import Stack from '../entity/stack';
import Position from '../entity/position';
import { findPositionById } from '../repository/position';
import { findStackById, removeStack, saveStack } from '../repository/stack';
import { deleteS3Image } from '../config/aws';

export const createStack = async (request: Request, response: Response) => {
  const { name, profile, positions = [] } = request.body;

  try {
    const positionData: Position[] = await Promise.all(
      positions.map(async (id: string) => {
        return await findPositionById(Number(id));
      }),
    );

    const stack = new Stack();
    stack.name = name;
    stack.profile = profile;
    stack.positions = positionData;

    const createdStack = await saveStack(stack);

    return response.status(201).json({ stack: createdStack });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const deleteStack = async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const findStack = await findStackById(Number(id));

    if (isEmpty(findStack)) {
      return response
        .status(400)
        .json({ message: `잘못된 스택 아이디입니다. ${id}` });
    }

    if (findStack.profile) {
      deleteS3Image(findStack.profile);
    }

    await removeStack(findStack);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};
