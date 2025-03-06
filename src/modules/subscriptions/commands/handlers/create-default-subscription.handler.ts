import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDefaultSubscriptionCommand } from '../create-default-subscription.command';
import { Subscription } from '../../subscriptions.entity';
import { SubscriptionsService } from '../../subscriptions.service';

@CommandHandler(CreateDefaultSubscriptionCommand)
export class CreateDefaultSubscriptionHandler
	implements ICommandHandler<CreateDefaultSubscriptionCommand>
{
	constructor(private readonly subscriptionsService: SubscriptionsService) {}

	async execute(
		command: CreateDefaultSubscriptionCommand,
	): Promise<Subscription> {
		const { userId } = command;
		return this.subscriptionsService.createDefaultSubscription(userId);
	}
}
