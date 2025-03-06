import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from '../plans/plans.entity';
import { User } from '../users/users.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './subscriptions.entity';

import {
	GetUserSubscriptionHandler,
	GetSubscriptionByUserIdHandler,
} from './queries';

import { UpdateSubscriptionHandler } from './commands';

const CommandHandlers = [UpdateSubscriptionHandler];
const QueryHandlers = [
	GetUserSubscriptionHandler,
	GetSubscriptionByUserIdHandler,
];

@Module({
	imports: [TypeOrmModule.forFeature([Subscription, Plan, User]), CqrsModule],
	controllers: [SubscriptionsController],
	providers: [...CommandHandlers, ...QueryHandlers],
	exports: [TypeOrmModule],
})
export class SubscriptionsModule {}
