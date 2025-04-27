import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';

export class VerifyPaymentIntentDto {
	@ApiProperty({
		description: 'Stripe payment intent ID',
		example: 'pi_1L2kF4KX9xdNcQ5kECrXFx6Y',
		required: false,
	})
	@IsString()
	@ValidateIf((o) => !o.paymentId)
	@IsNotEmpty({
		message: 'You must provide either paymentIntentId or paymentId',
	})
	paymentIntentId?: string;

	@ApiProperty({
		description: 'Payment ID in the system',
		example: '0f624e03-bdee-49b7-b9b2-a0adef3a5a3c',
		required: false,
	})
	@IsUUID()
	@ValidateIf((o) => !o.paymentIntentId)
	@IsNotEmpty({
		message: 'You must provide either paymentIntentId or paymentId',
	})
	paymentId?: string;
}
