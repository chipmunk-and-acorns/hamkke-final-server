import * as express from 'express';
import {
  createPosition,
  deletePosition,
  getPosition,
  getPositionList,
  updatePosition,
} from '../controller/position';

const route = express.Router();

route.post('/', createPosition);
route.get('/', getPositionList);
route.get('/:id', getPosition);
route.patch('/:id', updatePosition);
route.delete('/:id', deletePosition);

export default route;
