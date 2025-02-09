import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

dotenv.config();

async function setupSwagger(app) {
	const config = new DocumentBuilder()
		.setTitle('NestJS API')
		.setDescription('API documentation for NestJS')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/docs', app, document);
}

async function setupDatabase() {
	const masterDataSource = new DataSource({
		type: 'postgres',
		host: process.env.DB_MASTER_HOST,
		port: Number(process.env.DB_MASTER_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		entities: [__dirname + '/**/*.entity{.ts,.js}'],
		migrations: [__dirname + '/migrations/*{.ts,.js}'],
		synchronize: false,
		migrationsRun: false,
	});

	console.log('⏳ Connecting to MASTER database to run migrations...');
	await masterDataSource.initialize();
	console.log('✅ Connected to MASTER database successfully.');

	console.log('⏳ Running migrations...');
	await masterDataSource.runMigrations();
	console.log('✅ Migrations applied successfully.');
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	await setupSwagger(app);
	await setupDatabase();

	app.useGlobalPipes(new ValidationPipe());

	const port = process.env.PORT || 3000;
	await app.listen(port);
	console.log(`🚀 Listening on port ${port}`);
}

bootstrap();
