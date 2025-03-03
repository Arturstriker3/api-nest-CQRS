import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePlanDto {
	@ApiProperty({
		example: 'Premium',
		description: 'Plan name',
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name: string;

	@ApiProperty({
		example: 'Premium plan with unlimited resources',
		description: 'Plan description',
		maxLength: 255,
		required: false,
	})
	@IsString()
	@IsOptional()
	@MaxLength(255)
	description?: string;

	@ApiProperty({
		example: 99.9,
		description: 'Plan price',
		minimum: 0,
	})
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@Type(() => Number)
	price: number;

	@ApiProperty({
		example: 30,
		description: 'Maximum number of projects allowed',
		minimum: 1,
	})
	@IsInt()
	@IsPositive()
	@Type(() => Number)
	maxProjects: number;

	@ApiProperty({
		example: 30,
		description: 'Plan duration in days',
		minimum: 0,
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
		default: true,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
