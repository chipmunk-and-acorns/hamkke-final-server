import * as express from 'express';
import {
  createStack,
  deleteStack,
  getStack,
  getStackList,
  updateStack,
} from '../controller/stack';
import { authCheck } from '../middleware/auth';

const route = express.Router();

route.post('/', authCheck, createStack);
route.get('/', getStackList);
route.get('/:id', authCheck, getStack);
route.patch('/:id', authCheck, updateStack);
route.delete('/:id', authCheck, deleteStack);

export default route;
