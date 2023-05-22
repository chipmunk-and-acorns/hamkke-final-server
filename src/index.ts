import express from 'express';
import configVar from './util/configVariable';
import { AppDataSource } from './db/db';

const app = express();
const port = configVar.server.port;

AppDataSource.initialize()
  .then(() => {
    console.log('connect Database...');

    app.listen(port, () => {
      console.log(`connect server at port number ${port}...`);
    });
  })
  .catch((err) => {
    console.error('Error: Database Initialize -> ', err);
  });
