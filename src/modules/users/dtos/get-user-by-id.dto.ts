import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetUserByIdDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'User ID (UUID)',
	})
	@IsUUID('4', { message: 'Invalid UUID format' })
	id: string;
}
