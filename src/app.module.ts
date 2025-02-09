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
				synchronize: false,
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
