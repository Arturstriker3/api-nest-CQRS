import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from '../subscriptions.entity';

export class GetSubscriptionResponseDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Subscription ID (UUID)',
	})
	id: string;

	@ApiProperty({
		example: {
			id: '550e8400-e29b-41d4-a716-446655440001',
			name: 'Premium Plan',
		},
		description: 'The plan associated with this subscription',
	})
	plan: {
		id: string;
		name: string;
	};

	@ApiProperty({
		example: '2023-01-01T00:00:00Z',
		description: 'Start date of the subscription',
	})
	startsAt: Date;

	@ApiProperty({
		example: '2024-01-01T00:00:00Z',
		description: 'Expiration date of the subscription',
	})
	expiresAt?: Date;

	@ApiProperty({
		example: '2023-01-01T00:00:00Z',
		description: 'Date when the subscription was created',
	})
	createdAt: Date;

	@ApiProperty({
		example: '2023-01-01T00:00:00Z',
		description: 'Date when the subscription was last updated',
	})
	updatedAt: Date;

	constructor(subscription: Subscription) {
		this.id = subscription.id;
		this.plan = {
			id: subscription.plan.id,
			name: subscription.plan.name,
		};
		this.startsAt = subscription.startsAt;
		this.expiresAt = subscription.expiresAt;
		this.createdAt = subscription.createdAt;
		this.updatedAt = subscription.updatedAt;
	}
}
