import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
	@ApiProperty({
		description: 'The refresh token used to generate a new access token',
	})
	refresh_token: string;
}
