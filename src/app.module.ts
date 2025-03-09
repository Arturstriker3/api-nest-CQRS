import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './config/logger.config';
import { SeedModule } from './seeds/seed.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				defaultMode: 'master',
				replication: {
					master: {
						host: configService.get<string>('DB_MASTER_HOST'),
						port: configService.get<number>('DB_MASTER_PORT'),
						username: configService.get<string>('DB_USERNAME'),
						password: configService.get<string>('DB_PASSWORD'),
						database: configService.get<string>('DB_NAME'),
					},
					slaves: [
						{
							host: configService.get<string>('DB_SLAVE_HOST'),
							port: configService.get<number>('DB_SLAVE_PORT'),
							username: configService.get<string>('DB_USERNAME'),
							password: configService.get<string>('DB_PASSWORD'),
							database: configService.get<string>('DB_NAME'),
						},
					],
				},
				synchronize: configService.get<string>('ORM_SYNC') === 'true',
				logging: configService.get<string>('ORM_LOGGING') === 'true',
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				migrations: [__dirname + '/migrations/*{.ts,.js}'],
				migrationsRun: true,
			}),
		}),

		CqrsModule,
		AuthModule,
		UsersModule,
		PlansModule,
		SubscriptionsModule,
		PaymentsModule,
		SeedModule,

		LoggerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				pinoHttp: {
					level: configService.get<string>('LOG_LEVEL') || 'trace',
				},
			}),
		}),
	],
	providers: [CustomLogger],
	exports: [CustomLogger],
})
export class AppModule {}
