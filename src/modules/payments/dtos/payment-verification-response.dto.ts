import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../payments.entity';

export class PaymentVerificationResponseDto {
	@ApiProperty({
		description: 'Payment ID in the system',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	paymentId: string;

	@ApiProperty({
		description: 'Provider payment intent ID (Stripe)',
		example: 'pi_1L2kF4KX9xdNcQ5kECrXFx6Y',
	})
	paymentIntentId: string;

	@ApiProperty({
		description: 'User ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	userId: string;

	@ApiProperty({
		description: 'Payment status',
		enum: PaymentStatus,
		example: PaymentStatus.COMPLETED,
	})
	status: PaymentStatus;

	@ApiProperty({
		description: 'Verification message',
		example: 'Payment verified successfully',
	})
	message: string;
}
