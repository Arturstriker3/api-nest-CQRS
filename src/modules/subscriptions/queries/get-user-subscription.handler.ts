import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../subscriptions.entity';
import { GetUserSubscriptionQuery } from './get-user-subscription.query';

@QueryHandler(GetUserSubscriptionQuery)
export class GetUserSubscriptionHandler
	implements IQueryHandler<GetUserSubscriptionQuery>
{
	constructor(
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
	) {}

	async execute(query: GetUserSubscriptionQuery): Promise<Subscription> {
		const { userId } = query;

		const subscription = await this.subscriptionRepository.findOne({
			where: { user: { id: userId } },
			relations: ['plan', 'user'],
		});

		if (!subscription) {
			throw new NotFoundException(
				`Subscription for user with ID ${userId} not found`,
			);
		}

		return subscription;
	}
}
