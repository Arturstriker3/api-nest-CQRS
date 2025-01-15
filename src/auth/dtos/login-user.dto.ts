import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({
		example: 'johndoe@email.com',
		description: 'E-mail do usuário',
	})
	@IsEmail()
	email: string;

	@ApiProperty({ example: '123456', description: 'Senha do usuário' })
	@IsNotEmpty()
	password: string;
}
