import path from 'path';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import config from '../util/configVariable';

export const AppDataSource = new DataSource({
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: true,
  logging: ['info', 'query', 'warn', 'error'],
  entities: [path.join(__dirname, '..', 'data', '**/*.entity.ts')],
});
