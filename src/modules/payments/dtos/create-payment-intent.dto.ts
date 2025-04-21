import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePaymentIntentDto {
	@ApiProperty({
		description: 'ID of the plan to subscribe to',
		example: '550e8400-e29b-41d4-a716-446655440000',
		required: true,
	})
	@IsUUID()
	@IsNotEmpty()
	planId: string;

	@ApiProperty({
		description: 'Payment description',
		example: 'Premium Plan Subscription',
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({ description: 'Additional payment metadata' })
	@IsOptional()
	metadata?: Record<string, any>;
}
