import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users.entity';

export class GetUserResponseDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'User ID',
	})
	id: string;

	@ApiProperty({
		example: 'John Doe',
		description: 'User name',
	})
	name: string;

	@ApiProperty({
		example: 'john@example.com',
		description: 'User email',
	})
	email: string;

	@ApiProperty({
		example: 'user',
		description: 'User role',
		enum: UserRole,
	})
	role: UserRole;

	@ApiProperty({
		example: '2024-03-02T23:45:28.000Z',
		description: 'Creation date',
	})
	createdAt: Date;

	@ApiProperty({
		example: '2024-03-02T23:45:28.000Z',
		description: 'Last update date',
	})
	updatedAt: Date;
}
