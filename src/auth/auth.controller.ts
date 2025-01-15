import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/register-user.command';
import { LoginUserCommand } from './commands/login-user.command';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('register')
	async register(@Body(ValidationPipe) data: RegisterUserDto) {
		return this.commandBus.execute(new RegisterUserCommand(data));
	}

	@Post('login')
	async login(@Body(ValidationPipe) data: LoginUserDto) {
		return this.commandBus.execute(new LoginUserCommand(data));
	}
}
