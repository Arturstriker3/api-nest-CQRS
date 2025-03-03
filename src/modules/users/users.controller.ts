import {
	Controller,
	Get,
	Param,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';
import { GetUserByIdDto } from './dtos/get-user-by-id.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user-decorator';
import { CurrentUserDto } from './dtos/get-current-user.dto';
import { GetCurrentUserQuery } from './queries/get-current-user.query';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { IsAdmin } from '../auth/decorators/is-admin.decorator';
import { GetUserResponseDto } from './dtos/get-user-by-id-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get current authenticated user' })
	@ApiResponse({ status: 200, description: 'User found', type: CurrentUserDto })
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Token missing or invalid',
	})
	async getCurrentUser(@CurrentUser() user: CurrentUserDto) {
		return this.queryBus.execute(new GetCurrentUserQuery(user.id));
	}

	@Get(':id')
	@IsAdmin()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@ApiOperation({ summary: 'Get user by id' })
	@ApiResponse({
		status: 200,
		description: 'User found',
		type: GetUserResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Invalid UUID format' })
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Token missing or invalid',
	})
	@ApiResponse({ status: 403, description: 'Forbidden' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async getUserById(@Param(ValidationPipe) params: GetUserByIdDto) {
		return this.queryBus.execute(new GetUserByIdQuery(params.id));
	}
}
