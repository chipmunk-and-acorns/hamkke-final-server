import { dataSource } from '../db/db';

const repository = dataSource.Position;

export const findPositionById = async (positionId: number) => {
  return await repository.findOneBy({ positionId });
};
