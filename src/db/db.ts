import * as path from 'path';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import config from '../config/configVariable';
import Member from '../entity/member';

export const AppDataSource = new DataSource({
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: true,
  logging: ['query', 'warn', 'error'],
  entities: [path.join(__dirname, '..', 'entity', '*.ts')],
});

export const dataSource = {
  Member: AppDataSource.getRepository(Member),
};
