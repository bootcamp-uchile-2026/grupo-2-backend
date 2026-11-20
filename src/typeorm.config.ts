import { DataSource } from 'typeorm';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [
    isProduction
      ? 'dist/**/*.entity.js'
      : 'src/**/*.entity.ts',
  ],

  migrations: [
    isProduction
      ? 'dist/database/migrations/*.js'
      : 'src/database/migrations/*.ts',
  ],

  synchronize: false,
});