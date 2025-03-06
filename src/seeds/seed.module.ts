import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SeedService } from './seed.service';
import { UserFactory } from './factories/user.factory';
import { User } from '../modules/users/users.entity';
import { Plan } from '../modules/plans/plans.entity';
import { PlanFactory } from './factories/plan.factory';
import { SubscriptionsModule } from '../modules/subscriptions/subscriptions.module';
import { Subscription } from '../modules/subscriptions/subscriptions.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Plan, Subscription]),
		ConfigModule,
		CqrsModule,
		SubscriptionsModule,
	],
	providers: [SeedService, PlanFactory, UserFactory],
	exports: [SeedService],
})
export class SeedModule {}
