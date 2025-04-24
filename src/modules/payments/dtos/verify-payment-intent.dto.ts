import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsUUID,
	IsOptional,
	ValidateIf,
} from 'class-validator';

export class VerifyPaymentIntentDto {
	@ApiProperty({
		description: 'ID do payment intent do Stripe',
		example: 'pi_1L2kF4KX9xdNcQ5kECrXFx6Y',
		required: false,
	})
	@IsString()
	@ValidateIf((o) => !o.paymentId)
	@IsNotEmpty({ message: 'Você deve fornecer paymentIntentId ou paymentId' })
	paymentIntentId?: string;

	@ApiProperty({
		description: 'ID do pagamento no sistema',
		example: '0f624e03-bdee-49b7-b9b2-a0adef3a5a3c',
		required: false,
	})
	@IsUUID()
	@ValidateIf((o) => !o.paymentIntentId)
	@IsNotEmpty({ message: 'Você deve fornecer paymentIntentId ou paymentId' })
	paymentId?: string;
}
