import * as express from 'express';

import memberRouter from './member';
import articleRouter from './article';
import commentRouter from './comment';
import stackRouter from './stack';
import imageRouter from './image';
import positionRouter from './position';

const route = express.Router();

route.use('/members', memberRouter);
route.use('/articles', articleRouter);
route.use('/comments', commentRouter);
route.use('/stacks', stackRouter);
// TODO: Client 배포시 배포 url s3 cors의 origin에 추가
route.use('/images', imageRouter);
route.use('/position', positionRouter);

export default route;
