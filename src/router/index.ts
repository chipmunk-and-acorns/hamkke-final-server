import * as express from 'express';

import memberRouter from './member';

const route = express.Router();

route.use('/members', memberRouter);

export default route;
