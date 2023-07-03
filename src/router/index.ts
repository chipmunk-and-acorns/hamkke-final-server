import * as express from 'express';

import memberRouter from './member';
import articleRouter from './article';
import commentRouter from './comment';
import stackRouter from './stack';
import imageRouter from './image';

const route = express.Router();

route.use('/members', memberRouter);
route.use('/articles', articleRouter);
route.use('/comments', commentRouter);
route.use('/stacks', stackRouter);
route.use('/images', imageRouter);

export default route;
