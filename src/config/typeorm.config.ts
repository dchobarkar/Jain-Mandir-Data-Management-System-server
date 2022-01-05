/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const DATABASE_CONFIG = config.get('database');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: DATABASE_CONFIG.type,
  host: DATABASE_CONFIG.host,
  port: DATABASE_CONFIG.port,
  username: DATABASE_CONFIG.userName,
  password: DATABASE_CONFIG.password,
  database: DATABASE_CONFIG.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: DATABASE_CONFIG.synchronize,
};
