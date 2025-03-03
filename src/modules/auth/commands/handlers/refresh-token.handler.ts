import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/users.entity';
import {
	BadRequestException,
	Inject,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenCommand } from '../refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
	implements ICommandHandler<RefreshTokenCommand>
{
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		@Inject(ConfigService) private readonly configService: ConfigService,
	) {}

	async execute(
		command: RefreshTokenCommand,
	): Promise<{ access_token: string; refresh_token: string }> {
		const { refresh_token } = command;

		try {
			const payload = this.jwtService.verify(refresh_token, {
				secret: this.configService.get('JWT_SECRET'),
			});

			if (!payload || !payload.id) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			const user = await this.userRepository.findOne({
				where: { id: payload.id },
			});

			if (!user || user.refreshToken !== refresh_token) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			const accessTokenExpiration = this.configService.get(
				'auth.accessTokenExpiration',
			);
			const refreshTokenExpiration = this.configService.get(
				'auth.refreshTokenExpiration',
			);

			const tokenPayload = { id: user.id, email: user.email, role: user.role };
			const new_access_token = this.jwtService.sign(tokenPayload, {
				expiresIn: accessTokenExpiration,
			});
			const new_refresh_token = this.jwtService.sign(tokenPayload, {
				expiresIn: refreshTokenExpiration,
			});

			user.refreshToken = new_refresh_token;
			await this.userRepository.save(user);

			return {
				access_token: new_access_token,
				refresh_token: new_refresh_token,
			};
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			throw new BadRequestException('Invalid token');
		}
	}
}
