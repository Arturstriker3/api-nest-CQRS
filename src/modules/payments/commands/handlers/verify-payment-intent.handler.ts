import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../../payments.entity';
import { VerifyPaymentIntentCommand } from '../verify-payment-intent.command';
import { StripeService } from '../../services/stripe.service';
import {
	Logger,
	NotFoundException,
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { SubscriptionsService } from '../../../subscriptions/subscriptions.service';

@CommandHandler(VerifyPaymentIntentCommand)
export class VerifyPaymentIntentHandler
	implements ICommandHandler<VerifyPaymentIntentCommand>
{
	private readonly logger = new Logger(VerifyPaymentIntentHandler.name);

	constructor(
		@InjectRepository(Payment)
		private paymentsRepository: Repository<Payment>,
		private stripeService: StripeService,
		private subscriptionsService: SubscriptionsService,
	) {}

	async execute(command: VerifyPaymentIntentCommand) {
		try {
			let payment: Payment | null = null;

			// Check which ID was provided and fetch the payment
			if (command.paymentId) {
				payment = await this.paymentsRepository.findOne({
					where: { id: command.paymentId },
				});
			} else if (command.paymentIntentId) {
				payment = await this.paymentsRepository.findOne({
					where: { providerPaymentId: command.paymentIntentId },
				});
			}

			if (!payment) {
				throw new NotFoundException(
					'Payment not found. Please check the provided ID.',
				);
			}

			// Check if we have the payment intent ID to verify with Stripe
			if (!payment.providerPaymentId) {
				throw new BadRequestException(
					'This payment does not have a provider intent ID for verification.',
				);
			}

			// Verify payment status in Stripe
			const paymentIntent = await this.stripeService.getPaymentIntent(
				payment.providerPaymentId,
			);

			// Map Stripe status to our system status
			const paymentStatus = this.stripeService.mapStripeStatus(
				paymentIntent.status,
			);

			// Update payment status in database
			const updatedPayment = await this.paymentsRepository.save({
				...payment,
				status: paymentStatus,
			});

			// If payment is successful and we have plan information, update user credits
			if (
				paymentStatus === PaymentStatus.COMPLETED &&
				payment.providerMetadata?.planId &&
				payment.subscriptionId
			) {
				try {
					await this.subscriptionsService.updateUserCreditsWithPayment(
						payment.userId,
						payment.providerMetadata.planId,
						payment.id,
					);
				} catch {
					throw new InternalServerErrorException(
						'Error updating user credits. Please try again later.',
					);
				}
			}

			return {
				paymentId: updatedPayment.id,
				paymentIntentId: updatedPayment.providerPaymentId,
				userId: updatedPayment.userId,
				status: updatedPayment.status,
				message: `Payment verified successfully. Status: ${updatedPayment.status}`,
			};
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			if (error.type && error.type.startsWith('Stripe')) {
				throw new BadRequestException(`Stripe error: ${error.message}`);
			}

			throw new InternalServerErrorException(
				'Error processing payment verification. Please try again later.',
			);
		}
	}
}
