export class VerifyPaymentIntentCommand {
	constructor(
		public readonly paymentIntentId?: string,
		public readonly paymentId?: string,
	) {}
}
