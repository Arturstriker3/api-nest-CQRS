import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_MASTER_HOST,
	port: Number(process.env.DB_MASTER_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: ['src/modules/**/*.entity.{ts,js}'],
	migrations: ['src/migrations/*.{ts,js}'],
});

export default dataSource;
