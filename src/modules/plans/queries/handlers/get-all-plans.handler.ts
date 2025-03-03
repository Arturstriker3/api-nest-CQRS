import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../../plans.entity';
import { GetAllPlansQuery } from '../get-all-plans.query';

@QueryHandler(GetAllPlansQuery)
export class GetAllPlansHandler implements IQueryHandler<GetAllPlansQuery> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(): Promise<Plan[]> {
		return this.planRepository.find({
			order: { createdAt: 'DESC' },
		});
	}
}
