import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';

@Controller('users')
export class UserController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get(':id')
	async getUserById(@Param('id') id: string) {
		return this.queryBus.execute(new GetUserByIdQuery(id));
	}
}
