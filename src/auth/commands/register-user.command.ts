import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/users.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dtos/register-user.dto';

export class RegisterUserCommand {
	constructor(public readonly data: RegisterUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
	implements ICommandHandler<RegisterUserCommand>
{
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(command: RegisterUserCommand): Promise<User> {
		const { name, email, password } = command.data;
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = this.userRepository.create({
			name,
			email,
			password: hashedPassword,
		});
		return this.userRepository.save(user);
	}
}
