import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function setupSwagger(app) {
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
