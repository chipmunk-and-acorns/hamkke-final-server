import { dataSource } from '../db/db';
import Stack from '../entity/stack';

const repository = dataSource.Stack;

export const saveStack = async (stack: Stack) => {
  return await repository.save(stack);
};

export const findStackById = async (stackId: number) => {
  return await repository.findOneBy({ stackId });
};
