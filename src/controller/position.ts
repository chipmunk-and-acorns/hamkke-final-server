import { Request, Response } from 'express';
import Position from '../entity/position';
import {
  findPosition,
  findPositionById,
  removePosition,
  savePosition,
} from '../repository/position';
import { isEmpty } from 'lodash';

export const createPosition = async (request: Request, response: Response) => {
  const { name } = request.body;
  try {
    const newPosition = new Position();
    newPosition.name = name;

    const createdPosition = savePosition(newPosition);

    return response.status(201).json({ position: createdPosition });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getPositionList = async (
  _request: Request,
  response: Response,
) => {
  try {
    const positions = await findPosition();

    return response.status(200).json({ positions });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const getPosition = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const position = await findPositionById(Number(id));

    return response.status(200).json({ position });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const updatePosition = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name } = request.body;
  try {
    const findPosition = await findPositionById(Number(id));

    if (isEmpty(findPosition)) {
      return response
        .status(400)
        .json({ message: '존재하지 않은 포지션입니다.' });
    }

    findPosition.name = name;

    const updatedPosition = await savePosition(findPosition);
    return response.status(200).json({ position: updatedPosition });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};

export const deletePosition = async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    const findPosition = await findPositionById(Number(id));

    if (isEmpty(findPosition)) {
      return response
        .status(400)
        .json({ message: '존재하지 않은 포지션입니다.' });
    }

    await removePosition(findPosition);

    return response.sendStatus(204);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
};
