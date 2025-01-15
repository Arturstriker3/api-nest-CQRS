import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';

@ApiTags('Users')
@Controller('users')
export class UserController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by id' })
	@ApiResponse({ status: 200, description: 'User found' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async getUserById(@Param('id') id: string) {
		return this.queryBus.execute(new GetUserByIdQuery(id));
	}
}
