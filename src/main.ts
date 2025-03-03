import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './config/logger.config';
import { SeedService } from './seeds/seed.service';
import { setupSwagger } from './config/swagger.config';

dotenv.config();

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
	console.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
