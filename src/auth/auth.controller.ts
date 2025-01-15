import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserCommand } from './commands/register-user.command';
import { LoginUserCommand } from './commands/login-user.command';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('register')
	@ApiOperation({ summary: 'Register user' })
	@ApiResponse({ status: 201, description: 'User created' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	async register(@Body(ValidationPipe) data: RegisterUserDto) {
		return this.commandBus.execute(new RegisterUserCommand(data));
	}

	@Post('login')
	@ApiOperation({ summary: 'Login user' })
	@ApiResponse({ status: 200, description: 'User logged in' })
	@ApiResponse({ status: 400, description: 'Bad request' })
	async login(@Body(ValidationPipe) data: LoginUserDto) {
		return this.commandBus.execute(new LoginUserCommand(data));
	}
}
