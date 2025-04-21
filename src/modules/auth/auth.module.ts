import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { CommandHandlers } from './commands/handlers';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from '../../config/auth.config';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PlansModule } from '../plans/plans.module';
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [authConfig] }),
		TypeOrmModule.forFeature([User]),
		CqrsModule,
		SubscriptionsModule,
		PlansModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: configService.get('auth.accessTokenExpiration') },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [...CommandHandlers, JwtStrategy],
	exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
