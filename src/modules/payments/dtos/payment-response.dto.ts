import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../payments.entity';

export class PaymentResponseDto {
	@ApiProperty({ description: 'Payment ID in the system' })
	paymentId: string;

	@ApiProperty({ description: 'Stripe payment intent ID' })
	paymentIntentId: string;

	@ApiProperty({ description: 'ID of the user who made the payment' })
	userId: string;

	@ApiProperty({
		description: 'Client secret for frontend integration',
		required: false,
	})
	clientSecret?: string;

	@ApiProperty({ description: 'Current payment status', enum: PaymentStatus })
	status: PaymentStatus;

	@ApiProperty({
		description: 'Refund ID (if applicable)',
		required: false,
	})
	refundId?: string;
}
