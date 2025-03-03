import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user-decorator';
import { CreateSubscriptionCommand } from './commands/create-subscription.command';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { GetUserSubscriptionQuery } from './queries/get-user-subscription.query';

@Controller('subscriptions')
export class SubscriptionsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async createSubscription(
		@Body() createSubscriptionDto: CreateSubscriptionDto,
		@CurrentUser() user: any,
	) {
		return this.commandBus.execute(
			new CreateSubscriptionCommand(createSubscriptionDto, user.id),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getUserSubscription(@CurrentUser() user: any) {
		return this.queryBus.execute(new GetUserSubscriptionQuery(user.id));
	}
}
