import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users.entity';

export class GetUserResponseDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'ID do usuário',
	})
	id: string;

	@ApiProperty({
		example: 'John Doe',
		description: 'Nome do usuário',
	})
	name: string;

	@ApiProperty({
		example: 'john@example.com',
		description: 'Email do usuário',
	})
	email: string;

	@ApiProperty({
		example: 'user',
		description: 'Role do usuário',
		enum: UserRole,
	})
	role: UserRole;

	@ApiProperty({
		example: '2024-03-02T23:45:28.000Z',
		description: 'Data de criação',
	})
	createdAt: Date;

	@ApiProperty({
		example: '2024-03-02T23:45:28.000Z',
		description: 'Data da última atualização',
	})
	updatedAt: Date;
}
