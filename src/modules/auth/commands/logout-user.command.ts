import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/users.entity';

export class LogoutUserCommand {
	constructor(public readonly userId: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(command: LogoutUserCommand): Promise<void> {
		const { userId } = command;

		await this.userRepository.update(userId, { refreshToken: null });
	}
}
