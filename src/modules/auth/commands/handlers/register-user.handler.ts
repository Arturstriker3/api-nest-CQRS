import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/users.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { RegisterUserCommand } from '../register-user.command';
import { RegisterUserResponseDto } from '../../dtos/register-user-response.dto';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
	implements ICommandHandler<RegisterUserCommand>
{
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async execute(command: RegisterUserCommand): Promise<RegisterUserResponseDto> {
		const { name, email, password } = command.data;

		const existingUser = await this.userRepository.findOne({ where: { email } });
		if (existingUser) {
			throw new ConflictException(`This email is already taken`);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = this.userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		const savedUser = await this.userRepository.save(user);

		return new RegisterUserResponseDto(savedUser);
	}
}
