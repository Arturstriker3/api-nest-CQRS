import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './config/logger.config';
import { SeedService } from './seeds/seed.service';

dotenv.config();

async function setupSwagger(app) {
	const config = new DocumentBuilder()
		.setTitle('NestJS API')
		.setDescription('API documentation for NestJS')
		.setVersion('1.0')
		.addBearerAuth()
		.addServer('/api')
		.build();

	const document = SwaggerModule.createDocument(app, config, {
		ignoreGlobalPrefix: true,
	});
	SwaggerModule.setup('api/docs', app, document);
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	await setupSwagger(app);

	app.useGlobalPipes(new ValidationPipe());

	const seedService = app.get(SeedService);
	await seedService.seed();

	const port = process.env.PORT || 3000;
	app.useLogger(app.get(CustomLogger));
	await app.listen(port);
	console.log(`🚀 Listening on port ${port}`);
}

bootstrap();
