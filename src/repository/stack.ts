import { dataSource } from '../db/db';

const repository = dataSource.Stack;

export const saveStack = async () => {};

export const findStackById = async (stackId: number) => {
  return await repository.findOneBy({ stackId });
};
