import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../payments.entity';

export class PaymentVerificationResponseDto {
	@ApiProperty({
		description: 'ID do pagamento no sistema',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	paymentId: string;

	@ApiProperty({
		description: 'ID do payment intent do provedor (Stripe)',
		example: 'pi_1L2kF4KX9xdNcQ5kECrXFx6Y',
	})
	paymentIntentId: string;

	@ApiProperty({
		description: 'ID do usuário',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	userId: string;

	@ApiProperty({
		description: 'Status do pagamento',
		enum: PaymentStatus,
		example: PaymentStatus.COMPLETED,
	})
	status: PaymentStatus;

	@ApiProperty({
		description: 'Mensagem de verificação',
		example: 'Pagamento verificado com sucesso',
	})
	message: string;
}
