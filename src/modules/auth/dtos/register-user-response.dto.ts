import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResponseDto {
	@ApiProperty({ example: 'John Doe', description: 'User full name' })
	name: string;

	@ApiProperty({ example: 'johndoe@email.com', description: 'User email' })
	email: string;

	@ApiProperty({
		example: '2025-01-15T12:24:25.766Z',
		description: 'User creation timestamp',
	})
	createdAt: Date;

	constructor(user: { name: string; email: string; createdAt: Date }) {
		this.name = user.name;
		this.email = user.email;
		this.createdAt = user.createdAt;
	}
}
