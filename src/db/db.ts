import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
import config from '../config/configVariable';
import Member from '../entity/member';
import Article from '../entity/article';
import Stack from '../entity/stack';
import Position from '../entity/position';
import ArticleStack from '../entity/articleStack';
import ArticlePosition from '../entity/articlePosition';
import StackPosition from '../entity/stackPosition';

const mysqlOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: true,
  logging: ['query', 'warn', 'error'],
  entities: [path.join(__dirname, '..', 'entity', '*.ts')],
};

export const AppDataSource = new DataSource(mysqlOptions);

export const dataSource = {
  Member: AppDataSource.getRepository(Member),
  Article: AppDataSource.getRepository(Article),
  Stack: AppDataSource.getRepository(Stack),
  Position: AppDataSource.getRepository(Position),
  ArticleStack: AppDataSource.getRepository(ArticleStack),
  ArticlePosition: AppDataSource.getRepository(ArticlePosition),
  StackPosition: AppDataSource.getRepository(StackPosition),
};
