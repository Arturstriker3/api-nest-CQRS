import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Plan } from '../../plans.entity';
import { DeactivatePlanCommand } from '../deactivate-plan.command';

@CommandHandler(DeactivatePlanCommand)
export class DeactivatePlanHandler
	implements ICommandHandler<DeactivatePlanCommand>
{
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(command: DeactivatePlanCommand): Promise<Plan> {
		const { id } = command;
		const plan = await this.planRepository.findOne({ where: { id } });

		if (!plan) {
			throw new NotFoundException(`Plan with ID "${id}" not found`);
		}

		plan.isActive = false;
		return this.planRepository.save(plan);
	}
}
