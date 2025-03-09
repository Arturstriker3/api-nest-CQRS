import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentStatus } from '../payments.entity';

@Injectable()
export class StripeService {
	private stripe: Stripe;
	private readonly logger = new Logger(StripeService.name);

	constructor(private configService: ConfigService) {
		const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
		if (!apiKey) {
			throw new Error('STRIPE_SECRET_KEY environment variable is not set');
		}

		this.stripe = new Stripe(apiKey, {
			apiVersion: '2025-02-24.acacia',
		});
	}

	async createPaymentIntent(options: {
		amount: number;
		currency: string;
		description?: string;
		metadata?: Record<string, any>;
		customerId?: string;
	}) {
		this.logger.debug(`Creating payment intent: ${JSON.stringify(options)}`);

		return this.stripe.paymentIntents.create({
			amount: Math.round(options.amount * 100), // Stripe uses cents
			currency: options.currency.toLowerCase(),
			description: options.description,
			metadata: options.metadata,
			customer: options.customerId,
		});
	}

	async confirmPaymentIntent(paymentIntentId: string) {
		this.logger.debug(`Confirming payment intent: ${paymentIntentId}`);
		return this.stripe.paymentIntents.confirm(paymentIntentId);
	}

	async cancelPaymentIntent(paymentIntentId: string) {
		this.logger.debug(`Canceling payment intent: ${paymentIntentId}`);
		return this.stripe.paymentIntents.cancel(paymentIntentId);
	}

	async getPaymentIntent(paymentIntentId: string) {
		this.logger.debug(`Getting payment intent: ${paymentIntentId}`);
		return this.stripe.paymentIntents.retrieve(paymentIntentId);
	}

	async refundPayment(paymentIntentId: string, amount?: number) {
		this.logger.debug(`Refunding payment: ${paymentIntentId}, amount: ${amount}`);
		return this.stripe.refunds.create({
			payment_intent: paymentIntentId,
			amount: amount ? Math.round(amount * 100) : undefined,
		});
	}

	async createCustomer(options: {
		email: string;
		name?: string;
		userId: string;
	}) {
		this.logger.debug(`Creating customer: ${JSON.stringify(options)}`);
		return this.stripe.customers.create({
			email: options.email,
			name: options.name,
			metadata: { userId: options.userId },
		});
	}
	async getCustomerByUserId(userId: string) {
		const customers = await this.stripe.customers.search({
			query: `metadata['userId']:'${userId}'`,
			limit: 1,
		});

		return customers.data.length > 0 ? customers.data[0] : null;
	}

	mapStripeStatus(stripeStatus: string): PaymentStatus {
		const statusMap: Record<string, PaymentStatus> = {
			requires_payment_method: PaymentStatus.PENDING,
			requires_confirmation: PaymentStatus.PENDING,
			requires_action: PaymentStatus.PENDING,
			processing: PaymentStatus.PROCESSING,
			requires_capture: PaymentStatus.PROCESSING,
			succeeded: PaymentStatus.COMPLETED,
			canceled: PaymentStatus.CANCELED,
		};

		return statusMap[stripeStatus] || PaymentStatus.PENDING;
	}
}
