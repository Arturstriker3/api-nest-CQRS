import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/users.entity';
import {
	BadRequestException,
	Inject,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class RefreshTokenCommand {
	constructor(public readonly refreshToken: string) {}
}

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
		const { refreshToken } = command;

		if (!refreshToken) {
			throw new BadRequestException('Refresh token is required');
		}

		let decoded;
		try {
			decoded = this.jwtService.verify(refreshToken);
		} catch (error) {
			throw new UnauthorizedException(
				`Invalid or expired refresh token: ${error.message}`,
			);
		}

		const user = await this.userRepository.findOne({
			where: { id: decoded.id, refreshToken },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}

		const accessTokenExpiration = this.configService.get(
			'auth.accessTokenExpiration',
		);
		const refreshTokenExpiration = this.configService.get(
			'auth.refreshTokenExpiration',
		);

		const payload = { id: user.id, email: user.email };
		const newAccessToken = this.jwtService.sign(payload, {
			expiresIn: accessTokenExpiration,
		});
		const newRefreshToken = this.jwtService.sign(payload, {
			expiresIn: refreshTokenExpiration,
		});

		user.refreshToken = newRefreshToken;
		await this.userRepository.save(user);

		return { access_token: newAccessToken, refresh_token: newRefreshToken };
	}
}
