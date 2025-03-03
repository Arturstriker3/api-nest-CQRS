import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UseGuards,
	Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiBody,
} from '@nestjs/swagger';
import { RegisterUserCommand } from './commands/register-user.command';
import { LoginUserCommand } from './commands/login-user.command';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { LogoutUserCommand } from './commands/logout-user.command';
import { CurrentUserDto } from './dtos/current-user.dto';
import { CurrentUser } from './decorators/current-user-decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterUserResponseDto } from './dtos/register-user-response.dto';
import { LoginUserResponseDto } from './dtos/login-user-response.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { apiSummaryWithAccess } from 'src/common/utils/swagger.utils';
import { UserAccessLevel } from 'src/common/utils/swagger.utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}
	private readonly logger = new Logger(AuthController.name);

	@Post('register')
	@ApiOperation({
		summary: apiSummaryWithAccess('Register user', UserAccessLevel.PUBLIC),
	})
	@ApiResponse({
		status: 201,
		description: 'User created',
		type: RegisterUserResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request' })
	async register(@Body(ValidationPipe) data: RegisterUserDto) {
		return this.commandBus.execute(new RegisterUserCommand(data));
	}

	@Post('login')
	@ApiOperation({
		summary: apiSummaryWithAccess('Login user', UserAccessLevel.PUBLIC),
	})
	@ApiResponse({
		status: 200,
		description: 'User logged in',
		type: LoginUserResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request' })
	async login(@Body(ValidationPipe) data: LoginUserDto) {
		return this.commandBus.execute(new LoginUserCommand(data));
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: apiSummaryWithAccess('Logout user', UserAccessLevel.USER),
	})
	@ApiResponse({ status: 200, description: 'User logged out successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async logout(@CurrentUser() user: CurrentUserDto) {
		await this.commandBus.execute(new LogoutUserCommand(user.id));
		return { message: 'User logged out successfully' };
	}

	@Post('refresh')
	@ApiOperation({
		summary: apiSummaryWithAccess('Refresh token', UserAccessLevel.PUBLIC),
	})
	@ApiBody({ type: RefreshTokenDto })
	@ApiResponse({
		status: 201,
		description: 'New access token',
		type: LoginUserResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async refresh(@Body('refresh_token') refreshToken: string) {
		return this.commandBus.execute(new RefreshTokenCommand(refreshToken));
	}
}
