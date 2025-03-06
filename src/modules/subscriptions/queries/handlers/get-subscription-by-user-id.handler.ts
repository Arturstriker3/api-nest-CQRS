import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../subscriptions.entity';
import { NotFoundException } from '@nestjs/common';
import { GetSubscriptionByUserIdQuery } from '../get-subscription-by-user-id.query';
import { GetSubscriptionResponseDto } from '../../dtos/get-subscription-response.dto';

@QueryHandler(GetSubscriptionByUserIdQuery)
export class GetSubscriptionByUserIdHandler
	implements IQueryHandler<GetSubscriptionByUserIdQuery>
{
	constructor(
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
	) {}

	async execute(
		query: GetSubscriptionByUserIdQuery,
	): Promise<GetSubscriptionResponseDto> {
		const subscription = await this.subscriptionRepository.findOne({
			where: { user: { id: query.userId } },
			relations: ['plan', 'user'],
		});

		if (!subscription) {
			throw new NotFoundException(
				`Subscription for user with ID ${query.userId} not found`,
			);
		}

		return new GetSubscriptionResponseDto(subscription);
	}
}
