import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './config/logger.config';

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

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await setupSwagger(app);
	app.useGlobalPipes(new ValidationPipe());
	const port = process.env.PORT || 3000;
	app.useLogger(app.get(CustomLogger));
	await app.listen(port);
	console.log(`🚀 Listening on port ${port}`);
}

bootstrap();
