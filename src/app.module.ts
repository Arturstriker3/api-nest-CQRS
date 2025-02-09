import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				replication: {
					master: {
						host: configService.get<string>('DB_MASTER_HOST', 'localhost'),
						port: configService.get<number>('DB_MASTER_PORT', 5432),
						username: configService.get<string>('DB_USERNAME', 'admin'),
						password: configService.get<string>('DB_PASSWORD', 'admin'),
						database: configService.get<string>('DB_NAME', 'mydatabase'),
					},
					slaves: [
						{
							host: configService.get<string>('DB_SLAVE_HOST', 'localhost'),
							port: configService.get<number>('DB_SLAVE_PORT', 5433),
							username: configService.get<string>('DB_USERNAME', 'admin'),
							password: configService.get<string>('DB_PASSWORD', 'admin'),
							database: configService.get<string>('DB_NAME', 'mydatabase'),
						},
					],
				},
				synchronize: true,
				logging: true,
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				migrations: [__dirname + '/migrations/*{.ts,.js}'],
				migrationsRun: false,
			}),
		}),

		CqrsModule,
		AuthModule,
		UsersModule,
	],
})
export class AppModule {}
