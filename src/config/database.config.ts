import { SequelizeModuleOptions } from '@nestjs/sequelize';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: true,
  autoLoadModels: true,
};
