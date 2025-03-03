import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

export class CreateSubscriptionCommand {
	constructor(
		public readonly createSubscriptionDto: CreateSubscriptionDto,
		public readonly userId: string,
	) {}
}
