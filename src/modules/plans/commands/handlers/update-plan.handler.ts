import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Plan } from '../../plans.entity';
import { UpdatePlanCommand } from '../update-plan.command';

@CommandHandler(UpdatePlanCommand)
export class UpdatePlanHandler implements ICommandHandler<UpdatePlanCommand> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(command: UpdatePlanCommand): Promise<Plan> {
		const { id, updatePlanDto } = command;
		const plan = await this.planRepository.findOne({ where: { id } });

		if (!plan) {
			throw new NotFoundException(`Plano com ID "${id}" não encontrado`);
		}

		if (updatePlanDto.name && updatePlanDto.name !== plan.name) {
			const existingPlan = await this.planRepository.findOne({
				where: { name: updatePlanDto.name },
			});

			if (existingPlan && existingPlan.id !== id) {
				throw new ConflictException(
					`Already exists a plan with the name ${updatePlanDto.name}`,
				);
			}
		}

		const updatedPlan = this.planRepository.merge(plan, updatePlanDto);
		return this.planRepository.save(updatedPlan);
	}
}
