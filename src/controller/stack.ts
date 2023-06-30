import { Request, Response } from 'express';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { isEmpty } from 'lodash';
import Stack from '../entity/stack';
import Position from '../entity/position';
import { findPositionById } from '../repository/position';
import { findStackById, removeStack, saveStack } from '../repository/stack';
import envConfig from '../config/configVariable';
import { s3 } from '../config/aws';

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
};
/* 
export const getStackList = async (request: Request, response: Response) => {};

export const getStack = async (request: Request, response: Response) => {};

export const updateStack = async (request: Request, response: Response) => {};

export const updateStackImage = async (
  request: Request,
  response: Response,
) => {};
*/

export const deleteStack = async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const findStack = await findStackById(Number(id));

    if (isEmpty(findStack)) {
      return response
        .status(400)
        .json({ message: `잘못된 스택 아이디입니다. ${id}` });
    }

    const file = findStack.profile;

    if (file) {
      const params: DeleteObjectCommandInput = {
        Bucket: envConfig.aws.s3.bucket,
        Key: file,
      };

      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    }

    await removeStack(findStack);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};
