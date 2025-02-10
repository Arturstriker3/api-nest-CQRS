import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/users.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dtos/login-user.dto';
import { ConfigService } from '@nestjs/config';

export class LoginUserCommand {
	constructor(public readonly data: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		@Inject(ConfigService) private readonly configService: ConfigService,
	) {}

	async execute(
		command: LoginUserCommand,
	): Promise<{ access_token: string; refresh_token: string }> {
		const { email, password } = command.data;

		const user = await this.userRepository.findOne({ where: { email } });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new BadRequestException('Invalid email or password');
		}

		const accessTokenExpiration = this.configService.get(
			'auth.accessTokenExpiration',
		);
		const refreshTokenExpiration = this.configService.get(
			'auth.refreshTokenExpiration',
		);

		const payload = { id: user.id, email: user.email };
		const access_token = this.jwtService.sign(payload, {
			expiresIn: accessTokenExpiration,
		});
		const refresh_token = this.jwtService.sign(payload, {
			expiresIn: refreshTokenExpiration,
		});

		user.refreshToken = refresh_token;
		await this.userRepository.save(user);

		return { access_token, refresh_token };
	}
}
