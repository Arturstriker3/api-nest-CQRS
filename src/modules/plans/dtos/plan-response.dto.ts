import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
	@ApiProperty({
		example: '550e8400-e29b-41d4-a716-446655440000',
		description: 'Plan ID',
	})
	id: string;

	@ApiProperty({
		example: 'Premium',
		description: 'Plan name',
	})
	name: string;

	@ApiProperty({
		example: 'Premium plan with unlimited resources',
		description: 'Plan description',
	})
	description: string;

	@ApiProperty({
		example: 99.9,
		description: 'Plan price',
	})
	price: number;

	@ApiProperty({
		example: 30,
		description: 'Maximum number of projects allowed',
	})
	maxProjects: number;

	@ApiProperty({
		example: 30,
		description: 'Plan duration in days',
	})
	durationDays: number;

	@ApiProperty({
		example: true,
		description: 'Whether the plan is active',
	})
	isActive: boolean;

	@ApiProperty({
		example: '2024-03-02T23:45:28.000Z',
		description: 'Creation date',
	})
	createdAt: Date;

	@ApiProperty({
		example: '2024-03-02T23:45:28.000Z',
		description: 'Last update date',
	})
	updatedAt: Date;
}
