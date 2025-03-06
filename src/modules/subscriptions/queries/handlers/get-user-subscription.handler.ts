import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../subscriptions.entity';
import { NotFoundException } from '@nestjs/common';
import { GetUserSubscriptionQuery } from '../get-user-subscription.query';
import { GetSubscriptionResponseDto } from '../../dtos/get-subscription-response.dto';

@QueryHandler(GetUserSubscriptionQuery)
export class GetUserSubscriptionHandler
	implements IQueryHandler<GetUserSubscriptionQuery>
{
	constructor(
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
	) {}

	async execute(
		query: GetUserSubscriptionQuery,
	): Promise<GetSubscriptionResponseDto> {
		const subscription = await this.subscriptionRepository.findOne({
			where: { user: { id: query.userId } },
			relations: ['plan', 'user'],
		});

		if (!subscription) {
			throw new NotFoundException(`Subscription for current user not found`);
		}

		return new GetSubscriptionResponseDto(subscription);
	}
}
