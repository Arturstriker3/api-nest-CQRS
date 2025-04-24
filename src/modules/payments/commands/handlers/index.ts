import { CreatePaymentIntentHandler } from './create-payment-intent.handler';
import { VerifyPaymentIntentHandler } from './verify-payment-intent.handler';

export const CommandHandlers = [
	CreatePaymentIntentHandler,
	VerifyPaymentIntentHandler,
];
