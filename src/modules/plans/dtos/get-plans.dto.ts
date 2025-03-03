import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class GetPlansDto extends PaginationDto {
	@ApiProperty({
		description: 'Filter by active status',
		required: false,
		type: Boolean,
	})
	@IsBoolean()
	@IsOptional()
	@Type(() => Boolean)
	isActive?: boolean;
}
