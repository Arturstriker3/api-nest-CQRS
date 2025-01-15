import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { RegisterUserHandler } from './commands/register-user.command';
import { LoginUserHandler } from './commands/login-user.command';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		CqrsModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'secret',
			signOptions: { expiresIn: '2d' },
		}),
	],
	controllers: [AuthController],
	providers: [RegisterUserHandler, LoginUserHandler],
})
export class AuthModule {}
