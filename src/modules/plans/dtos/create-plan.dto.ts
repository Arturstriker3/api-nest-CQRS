import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class CreatePlanDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	price: number;

	@IsInt()
	@IsPositive()
	maxProjects: number;

	@IsInt()
	@IsPositive()
	@IsOptional()
	durationDays?: number;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
