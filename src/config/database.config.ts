import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export default registerAs('db', () => ({
  host: process.env.DATABASE_HOST,
  type: 'mysql',
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  timezone: 'Z',
  logging: process.env.ORM_LOGGING === 'true',
  autoLoadEntities: true,
  keepConnectionAlive: true,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  extra: {
    connectionLimit: parseInt(process.env.ORM_CONNECTION_LIMIT || '10', 10),
    charset: 'utf8mb4_general_ci', // Hoặc utf8mb4_unicode_ci
  },
  charset: 'utf8mb4', // Đảm bảo kết nối hỗ trợ emoji
}));
