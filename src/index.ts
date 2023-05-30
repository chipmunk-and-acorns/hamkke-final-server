import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsdoc from 'swagger-jsdoc';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

import rootRouter from './router';
import { AppDataSource } from './db/db';
import RedisClient from './db/redis';
import SwaggerOptions from './config/swagger';
import configVar from './config/configVariable';

const app = express();
const port = configVar.server.port;
const spec = swaggerJsdoc(SwaggerOptions);
const env = process.env.NODE_ENV;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan(configVar.server.morgan));
app.use(helmet());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(spec, { explorer: true }),
);
app.use('/api', rootRouter);
app.use(
  (error: any, _request: Request, response: Response, _next: NextFunction) => {
    console.error(error);

    return response.status(500).json({
      message: '서버에러가 발생했습니다. 잠시후 다시 시도해주세요.',
      error,
    });
  },
);

const initializeApp = async () => {
  try {
    if (env !== 'test') {
      await AppDataSource.initialize();
      await RedisClient.connect();
    }
    app.listen(port, () => {
      console.log('connect database...');
      console.log('connect redis server...');
      console.log(`connect server at port number ${port}...`);
    });
  } catch (error) {
    console.error(error);
    RedisClient.disconnect();
    throw new Error('Server Error');
  }
};

initializeApp();

export default app;
