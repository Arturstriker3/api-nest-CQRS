import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../../payments.entity';
import { CreatePaymentIntentCommand } from '../create-payment-intent.command';
import { StripeService } from '../../services/stripe.service';
import {
	Logger,
	NotFoundException,
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../../users/users.entity';
import { Plan } from '../../../plans/plans.entity';
import { Subscription } from '../../../subscriptions/subscriptions.entity';

@CommandHandler(CreatePaymentIntentCommand)
export class CreatePaymentIntentHandler
	implements ICommandHandler<CreatePaymentIntentCommand>
{
	private readonly logger = new Logger(CreatePaymentIntentHandler.name);

	constructor(
		@InjectRepository(Payment)
		private paymentsRepository: Repository<Payment>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Plan)
		private planRepository: Repository<Plan>,
		@InjectRepository(Subscription)
		private subscriptionRepository: Repository<Subscription>,
		private stripeService: StripeService,
	) {}

	async execute(command: CreatePaymentIntentCommand) {
		const user = await this.usersRepository.findOne({
			where: { id: command.userId },
		});

		if (!user) {
			throw new NotFoundException(
				`User not found. Please check if the account is still active.`,
			);
		}

		const plan = await this.planRepository.findOne({
			where: { id: command.planId },
		});

		if (!plan) {
			throw new NotFoundException(`Plan with ID "${command.planId}" not found.`);
		}

		const amount = plan.price;

		const subscription = await this.subscriptionRepository.findOne({
			where: { user: { id: command.userId } },
		});

		if (!subscription) {
			throw new BadRequestException(
				'No subscription found for the user. Please register a subscription before making a payment.',
			);
		}

		const payment = this.paymentsRepository.create({
			userId: command.userId,
			subscriptionId: subscription.id, // Usando o ID da assinatura encontrada
			amount: amount,
			currency: command.currency,
			provider: command.provider,
			description: command.description || `Subscription to ${plan.name} plan`,
			status: PaymentStatus.PENDING,
			providerMetadata: {
				...command.metadata,
				planId: plan.id,
				planName: plan.name,
			},
		});

		await this.paymentsRepository.save(payment);

		try {
			let customerId = null;
			const existingCustomer = await this.stripeService.getCustomerByUserId(
				command.userId,
			);

			if (existingCustomer) {
				customerId = existingCustomer.id;
			} else {
				const newCustomer = await this.stripeService.createCustomer({
					email: user.email,
					name: user.name,
					userId: command.userId,
				});
				customerId = newCustomer.id;

				payment.providerCustomerId = customerId;
				await this.paymentsRepository.save(payment);
			}

			const { id, client_secret, status } =
				await this.stripeService.createPaymentIntent({
					amount: amount,
					currency: command.currency,
					description: payment.description,
					metadata: {
						userId: command.userId,
						paymentId: payment.id,
						planId: plan.id,
						planName: plan.name,
						...command.metadata,
					},
					customerId,
				});

			const updatedPayment = await this.paymentsRepository.save({
				...payment,
				providerPaymentId: id,
				status: this.stripeService.mapStripeStatus(status),
				providerMetadata: {
					...payment.providerMetadata,
					clientSecret: client_secret,
				},
			});

			return {
				paymentId: updatedPayment.id,
				paymentIntentId: id,
				userId: command.userId,
				clientSecret: client_secret,
				status: updatedPayment.status,
			};
		} catch (error) {
			await this.paymentsRepository.update(payment.id, {
				status: PaymentStatus.FAILED,
				errorMessage: error.message,
			});

			this.logger.error(
				`Failed to create payment intent: ${error.message}`,
				error.stack,
			);

			if (error.type && error.type.startsWith('Stripe')) {
				if (error.code === 'currency_not_supported') {
					throw new BadRequestException(
						`Currency not supported: ${command.currency}`,
					);
				}
				if (error.code === 'parameter_invalid_integer') {
					throw new BadRequestException('Invalid payment amount');
				}
				if (error.code === 'authentication_required') {
					throw new BadRequestException(
						'Payment requires additional authentication',
					);
				}
			}

			throw new InternalServerErrorException(
				'Error processing payment. Please try again later.',
			);
		}
	}
}
