import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../plans.entity';
import { GetPlanByIdQuery } from './get-plan-by-id.query';

@QueryHandler(GetPlanByIdQuery)
export class GetPlanByIdHandler implements IQueryHandler<GetPlanByIdQuery> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(query: GetPlanByIdQuery): Promise<Plan> {
		const { id } = query;
		const plan = await this.planRepository.findOne({
			where: { id },
		});

		if (!plan) {
			throw new NotFoundException(`Plan with ID ${id} not found`);
		}

		return plan;
	}
}
