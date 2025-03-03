import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSubscriptionHandler } from './commands/create-subscription.handler';
import { Plan } from '../plans/plans.entity';
import { User } from '../users/users.entity';
import { GetUserSubscriptionHandler } from './queries/get-user-subscription.handler';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './subscriptions.entity';

const CommandHandlers = [CreateSubscriptionHandler];
const QueryHandlers = [GetUserSubscriptionHandler];

@Module({
	imports: [TypeOrmModule.forFeature([Subscription, Plan, User]), CqrsModule],
	controllers: [SubscriptionsController],
	providers: [...CommandHandlers, ...QueryHandlers],
	exports: [TypeOrmModule],
})
export class SubscriptionsModule {}
