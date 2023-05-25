import * as express from 'express';

import memberRouter from './member';

const route = express.Router();

route.use('/member', memberRouter);

export default route;
