import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import Stack from '../entity/stack';
import Position from '../entity/position';
import { findPositionById } from '../repository/position';
import { findStackById, removeStack, saveStack } from '../repository/stack';
import { deleteS3Image } from '../config/aws';

export const createStack = async (request: Request, response: Response) => {
  const { name, profile, positions = [] } = request.body;

  /**
   * [INFO]
   * Image 업로드 [presignedURL]
   * 1. Client -> Server: ContentType을 첨부하여 서버로 업로드 URL받기
   * 2. Server -> AWS S3 -> Server: ContentType을 이용하여 key를 생성한 뒤, presignedURL 생성
   * 3. Server -> Client: 생성된 key와 presignedURL을 리턴
   * 4. Client -> AWS S3: URL을 이용하여 해당 파일을 formData로 업로드
   * 5. Client -> Server: 업로드 후 해당 이미지 url을 다른 생성 API에 같이 첨부하여 전송(sting)
   */

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
