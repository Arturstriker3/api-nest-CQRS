import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserDto {
	@ApiProperty()
	id: string;
	@ApiProperty()
	name: string;
	@ApiProperty()
	email: string;
}
