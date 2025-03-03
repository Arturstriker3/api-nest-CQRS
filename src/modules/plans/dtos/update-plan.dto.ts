import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlanDto {
	@ApiProperty({
		example: 'Premium',
		description: 'Plan name',
		required: false,
	})
	@IsString()
	@MaxLength(100)
	@IsOptional()
	name?: string;

	@ApiProperty({
		example: 'Premium plan with unlimited resources',
		description: 'Plan description',
		required: false,
	})
	@IsString()
	@MaxLength(255)
	@IsOptional()
	description?: string;

	@ApiProperty({
		example: 99.9,
		description: 'Plan price',
		required: false,
	})
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@IsOptional()
	@Type(() => Number)
	price?: number;

	@ApiProperty({
		example: 30,
		description: 'Maximum number of projects allowed',
		required: false,
	})
	@IsInt()
	@IsPositive()
	@IsOptional()
	@Type(() => Number)
	maxProjects?: number;

	@ApiProperty({
		example: 30,
		description: 'Plan duration in days',
		required: false,
	})
	@IsInt()
	@IsPositive()
	@IsOptional()
	@Type(() => Number)
	durationDays?: number;

	@ApiProperty({
		example: true,
		description: 'Whether the plan is active',
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
