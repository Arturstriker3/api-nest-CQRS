import { PaymentProvider } from '../payments.entity';

export class CreatePaymentIntentCommand {
	constructor(
		public readonly userId: string,
		public readonly currency: string = 'USD',
		public readonly planId: string,
		public readonly description?: string,
		public readonly provider: PaymentProvider = PaymentProvider.STRIPE,
		public readonly metadata?: Record<string, any>,
	) {}
}
