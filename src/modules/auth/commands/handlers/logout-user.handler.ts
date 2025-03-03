import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/users.entity';
import { NotFoundException } from '@nestjs/common';
import { LogoutUserCommand } from '../logout-user.command';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(command: LogoutUserCommand): Promise<void> {
		const { userId } = command;

		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}

		user.refreshToken = null;
		await this.userRepository.save(user);
	}
}
