import { dataSource } from '../db/db';
import Stack from '../entity/stack';

const repository = dataSource.Stack;

export const saveStack = async (stack: Stack) => {
  return await repository.save(stack);
};

export const findStackById = async (stackId: number) => {
  return await repository.findOneBy({ stackId });
};

export const findStacks = async () => {
  return await repository.find();
};

export const removeStack = async (stack: Stack) => {
  return await repository.remove(stack);
};
