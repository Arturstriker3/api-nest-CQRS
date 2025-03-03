import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePlanHandler } from './commands/create-plan.handler';
import { UpdatePlanHandler } from './commands/update-plan.handler';
import { DeletePlanHandler } from './commands/delete-plan.handler';
import { PlansController } from './plans.controller';
import { Plan } from './plans.entity';
import { GetAllPlansHandler } from './queries/get-all-plans.handler';
import { GetPlanByIdHandler } from './queries/get-plan-by-id.handler';
import { GetPlansHandler } from './queries/get-plans.handler';

const CommandHandlers = [
	CreatePlanHandler,
	UpdatePlanHandler,
	DeletePlanHandler,
];

const QueryHandlers = [GetAllPlansHandler, GetPlanByIdHandler, GetPlansHandler];

@Module({
	imports: [TypeOrmModule.forFeature([Plan]), CqrsModule],
	controllers: [PlansController],
	providers: [...CommandHandlers, ...QueryHandlers],
	exports: [TypeOrmModule],
})
export class PlansModule {}
