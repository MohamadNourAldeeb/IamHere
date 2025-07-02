import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export const CashingOptions = {
  host: process.env.REDIS_HOST as string,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD as string,
};
