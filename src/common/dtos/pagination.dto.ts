import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
	@ApiProperty({
		description: 'Page number (starts from 1)',
		default: 1,
		required: false,
	})
	@IsInt()
	@Min(1)
	@IsOptional()
	@Type(() => Number)
	page?: number = 1;

	@ApiProperty({
		description: 'Number of items per page',
		default: 10,
		required: false,
	})
	@IsInt()
	@Min(1)
	@IsOptional()
	@Type(() => Number)
	limit?: number = 10;
}

export class PaginatedResponseDto<T> {
	@ApiProperty({
		description: 'Array of items',
	})
	items: T[];

	@ApiProperty({
		description: 'Total number of items',
		example: 100,
	})
	total: number;

	@ApiProperty({
		description: 'Current page',
		example: 1,
	})
	page: number;

	@ApiProperty({
		description: 'Number of items per page',
		example: 10,
	})
	limit: number;

	@ApiProperty({
		description: 'Total number of pages',
		example: 10,
	})
	totalPages: number;

	@ApiProperty({
		description: 'Has next page',
		example: true,
	})
	hasNext: boolean;

	@ApiProperty({
		description: 'Has previous page',
		example: false,
	})
	hasPrevious: boolean;
}
