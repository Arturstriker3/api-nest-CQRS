import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
	@ApiProperty({ example: 'John Doe', description: 'User name' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		example: 'johndoe@email.com',
		description: 'User email',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: '123456',
		description: 'User password',
		minLength: 6,
	})
	@MinLength(6)
	password: string;
}
