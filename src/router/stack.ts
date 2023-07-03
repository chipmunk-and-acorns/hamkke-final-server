import * as express from 'express';
import { createStack, deleteStack } from '../controller/stack';
import { authCheck } from '../middleware/auth';

const route = express.Router();

route.post('/', authCheck, createStack);
route.delete('/:id', deleteStack);

export default route;
