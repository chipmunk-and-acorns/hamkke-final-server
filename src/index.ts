import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsdoc from 'swagger-jsdoc';

import AppDataSource from './db/db';
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));

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
