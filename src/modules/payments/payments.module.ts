import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payments.entity';
import { User } from '../users/users.entity';
import { PaymentsController } from './payments.controller';
import { CommandHandlers } from './commands/handlers';
import { StripeService } from './services/stripe.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { Plan } from '../plans/plans.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Subscription } from '../subscriptions/subscriptions.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Payment, User, Plan, Subscription]),
		CqrsModule,
		ConfigModule,
		AuthModule,
		SubscriptionsModule,
	],
	controllers: [PaymentsController],
	providers: [...CommandHandlers, StripeService, SubscriptionsService],
	exports: [StripeService],
})
export class PaymentsModule {}
