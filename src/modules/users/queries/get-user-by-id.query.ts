import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { NotFoundException } from '@nestjs/common';
import { GetUserResponseDto } from '../dtos/get-user-by-id-response.dto';

export class GetUserByIdQuery {
	constructor(public readonly id: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(query: GetUserByIdQuery): Promise<GetUserResponseDto> {
		const user = await this.userRepository.findOne({
			where: { id: query.id },
			select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${query.id} not found`);
		}

		return user;
	}
}
