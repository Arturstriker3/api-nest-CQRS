import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
	@ApiProperty({ example: 'access_token', description: 'Access token' })
	access_token: string;

	@ApiProperty({ example: 'refresh_token', description: 'Refresh token' })
	refresh_token: string;
}
