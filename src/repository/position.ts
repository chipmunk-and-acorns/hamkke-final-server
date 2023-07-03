import { dataSource } from '../db/db';
import Position from '../entity/position';

const repository = dataSource.Position;

export const savePosition = async (position: Position) => {
  return await repository.save(position);
};

export const findPosition = async () => {
  return await repository.find();
};

export const findPositionById = async (positionId: number) => {
  return await repository.findOneBy({ positionId });
};

export const removePosition = async (position: Position) => {
  return await repository.remove(position);
};
