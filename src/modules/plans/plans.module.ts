import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { PlansController } from './plans.controller';
import { Plan } from './plans.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Plan, Subscription]), CqrsModule],
	controllers: [PlansController],
	providers: [...CommandHandlers, ...QueryHandlers],
	exports: [TypeOrmModule],
})
export class PlansModule {}
