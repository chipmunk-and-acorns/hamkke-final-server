import * as express from 'express';
import {
  createStack,
  // deleteStack,
  // getStack,
  // getStackList,
  // updateStack,
  // updateStackImage,
} from '../controller/stack';
import { upload } from '../middleware/image';
import { authCheck } from '../middleware/auth';

const route = express.Router();

route.post('/', authCheck, upload.single('image'), createStack);
// route.get('/', getStackList);
// route.get('/:id', getStack);
// route.patch('/:id', updateStack);
// route.patch('/image/:id', upload.single('image'), updateStackImage);
// route.delete('/:id', deleteStack);

export default route;
