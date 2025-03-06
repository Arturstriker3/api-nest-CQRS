import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class UpdateSubscriptionDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Plan ID (UUID)',
		required: false,
	})
	@IsUUID('4', { message: 'Invalid UUID format for planId' })
	@IsOptional()
	planId?: string;

	@ApiProperty({
		example: '2023-01-01T00:00:00Z',
		description: 'Start date of the subscription',
		required: false,
	})
	@IsDateString({}, { message: 'startsAt must be a valid ISO date string' })
	@IsOptional()
	startsAt?: string;

	@ApiProperty({
		example: '2024-01-01T00:00:00Z',
		description: 'Expiration date of the subscription',
		required: false,
	})
	@IsDateString({}, { message: 'expiresAt must be a valid ISO date string' })
	@IsOptional()
	expiresAt?: string;
}
