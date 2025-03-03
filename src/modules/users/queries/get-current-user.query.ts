import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { NotFoundException } from '@nestjs/common';
import { CurrentUserDto } from '../dtos/get-current-user.dto';

export class GetCurrentUserQuery {
	constructor(public readonly id: string) {}
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler
	implements IQueryHandler<GetCurrentUserQuery>
{
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(query: GetCurrentUserQuery): Promise<CurrentUserDto> {
		const user = await this.userRepository.findOne({ where: { id: query.id } });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return { id: user.id, name: user.name, email: user.email };
	}
}
