import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../../plans.entity';
import { CreatePlanCommand } from '../create-plan.command';

@CommandHandler(CreatePlanCommand)
export class CreatePlanHandler implements ICommandHandler<CreatePlanCommand> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(command: CreatePlanCommand): Promise<Plan> {
		const { createPlanDto } = command;
		const plan = this.planRepository.create(createPlanDto);
		return this.planRepository.save(plan);
	}
}
