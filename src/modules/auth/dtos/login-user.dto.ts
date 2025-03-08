import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({
		example: 'johndoe@email.com',
		description: 'User email',
	})
	@IsEmail()
	email: string;

	@ApiProperty({ example: '123456', description: 'User password' })
	@IsNotEmpty()
	password: string;
}
