import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dtos/login-user.dto';

export class LoginUserCommand {
	constructor(public readonly data: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async execute(command: LoginUserCommand): Promise<{ accessToken: string }> {
		const { email, password } = command.data;

		const user = await this.userRepository.findOne({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const payload = { id: user.id, email: user.email };
		const accessToken = this.jwtService.sign(payload);

		return { accessToken };
	}
}
