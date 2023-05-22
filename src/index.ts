import express from 'express';
import configVar from './util/configVariable';

const app = express();
const port = configVar.server.port;

app.listen(port, () => {
  console.log(`connect server at port number ${port}...`);
});
