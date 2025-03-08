import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Plan } from '../../plans.entity';
import { DeletePlanCommand } from '../delete-plan.command';
import { Subscription } from '../../../subscriptions/subscriptions.entity';

@CommandHandler(DeletePlanCommand)
export class DeletePlanHandler implements ICommandHandler<DeletePlanCommand> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
	) {}

	async execute(command: DeletePlanCommand): Promise<void> {
		const { id } = command;
		const plan = await this.planRepository.findOne({
			where: { id },
			relations: ['subscriptions'],
		});

		if (!plan) {
			throw new NotFoundException(`Plano com ID "${id}" não encontrado`);
		}

		const subscriptionsCount = await this.subscriptionRepository.count({
			where: { plan: { id: plan.id } },
		});

		if (subscriptionsCount > 0) {
			throw new BadRequestException(
				`Cannot delete plan with active subscriptions. Exist ${subscriptionsCount} active subscriptions`,
			);
		}

		await this.planRepository.remove(plan);
	}
}
