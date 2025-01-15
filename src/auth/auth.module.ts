import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { RegisterUserHandler } from './commands/register-user.command';
import { LoginUserHandler } from './commands/login-user.command';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenHandler } from './commands/refresh-token.command';
import authConfig from '../config/auth.config';

const CommandHandlers = [
	RegisterUserHandler,
	LoginUserHandler,
	RefreshTokenHandler,
];

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [authConfig] }),
		TypeOrmModule.forFeature([User]),
		CqrsModule,
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
