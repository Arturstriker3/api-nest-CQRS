import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserDto {
	@ApiProperty()
	id: string;
	@ApiProperty()
	email: string;
}
