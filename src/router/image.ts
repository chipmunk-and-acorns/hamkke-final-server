import * as express from 'express';

import { preSignImage } from '../controller/image';

const route = express.Router();

route.post('/presigned', preSignImage);

export default route;
