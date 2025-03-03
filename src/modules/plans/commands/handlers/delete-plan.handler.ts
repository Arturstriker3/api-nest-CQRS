import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Plan } from '../../plans.entity';
import { DeletePlanCommand } from '../delete-plan.command';

@CommandHandler(DeletePlanCommand)
export class DeletePlanHandler implements ICommandHandler<DeletePlanCommand> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(command: DeletePlanCommand): Promise<void> {
		const { id } = command;
		const plan = await this.planRepository.findOne({ where: { id } });

		if (!plan) {
			throw new NotFoundException(`Plan with ID "${id}" not found`);
		}

		await this.planRepository.remove(plan);
	}
}
