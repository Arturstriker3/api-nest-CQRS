import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users.entity';
import { NotFoundException } from '@nestjs/common';
import { GetCurrentUserQuery } from '../get-current-user.query';
import { GetUserResponseDto } from '../../dtos/get-user-by-id-response.dto';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler
	implements IQueryHandler<GetCurrentUserQuery>
{
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(query: GetCurrentUserQuery): Promise<GetUserResponseDto> {
		const user = await this.userRepository.findOne({
			where: { id: query.userId },
			select: ['email', 'name', 'role'],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${query.userId} not found`);
		}

		return user;
	}
}
