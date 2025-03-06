import { UpdateSubscriptionDto } from '../dtos/update-subscription.dto';

export class UpdateSubscriptionCommand {
	constructor(
		public readonly userId: string,
		public readonly data: UpdateSubscriptionDto,
	) {}
}
