import * as express from 'express';

import memberRouter from './member';
import articleRouter from './article';

const route = express.Router();

route.use('/members', memberRouter);
route.use('/articles', articleRouter);

export default route;
