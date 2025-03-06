import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../subscriptions.entity';
import { Plan } from 'src/modules/plans/plans.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateSubscriptionCommand } from '../update-subscription.command';
import { GetSubscriptionResponseDto } from '../../dtos/get-subscription-response.dto';

@CommandHandler(UpdateSubscriptionCommand)
export class UpdateSubscriptionHandler
	implements ICommandHandler<UpdateSubscriptionCommand>
{
	constructor(
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
		@InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
	) {}

	async execute(
		command: UpdateSubscriptionCommand,
	): Promise<GetSubscriptionResponseDto> {
		const { userId, data } = command;

		// Find the subscription
		const subscription = await this.subscriptionRepository.findOne({
			where: { user: { id: userId } },
			relations: ['plan', 'user'],
		});

		if (!subscription) {
			throw new NotFoundException(
				`Subscription for user with ID ${userId} not found`,
			);
		}

		// Update plan if provided
		if (data.planId) {
			const plan = await this.planRepository.findOne({
				where: { id: data.planId },
			});
			if (!plan) {
				throw new NotFoundException(`Plan with ID ${data.planId} not found`);
			}
			subscription.plan = plan;
		}

		// Update dates if provided
		if (data.startsAt) {
			subscription.startsAt = new Date(data.startsAt);
		}

		if (data.expiresAt) {
			subscription.expiresAt = new Date(data.expiresAt);
		}

		// Save the updated subscription
		const updatedSubscription =
			await this.subscriptionRepository.save(subscription);

		return new GetSubscriptionResponseDto(updatedSubscription);
	}
}
