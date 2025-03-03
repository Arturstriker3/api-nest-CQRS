import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsIn } from 'class-validator';
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

	@ApiProperty({
		description: 'Campo para ordenação',
		required: false,
		default: 'createdAt',
		enum: ['id', 'name', 'createdAt', 'updatedAt', 'price', 'durationDays'],
	})
	@IsString()
	@IsOptional()
	sortBy?: string;

	@ApiProperty({
		description: 'Direção da ordenação',
		required: false,
		default: 'DESC',
		enum: ['ASC', 'DESC'],
	})
	@IsString()
	@IsIn(['ASC', 'DESC'])
	@IsOptional()
	sortOrder?: 'ASC' | 'DESC';
}
