import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../../plans.entity';
import { GetPlansQuery } from '../get-plans.query';

@QueryHandler(GetPlansQuery)
export class GetPlansHandler implements IQueryHandler<GetPlansQuery> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(
		query: GetPlansQuery,
	): Promise<{ plans: Plan[]; total: number }> {
		const { getPlansDto } = query;
		const {
			page = 1,
			limit = 10,
			sortBy = 'createdAt',
			sortOrder = 'DESC',
		} = getPlansDto;

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// Create query builder
		const queryBuilder = this.planRepository.createQueryBuilder('plan');

		// Apply sorting
		queryBuilder.orderBy(`plan.${sortBy}`, sortOrder as 'ASC' | 'DESC');

		// Apply pagination
		queryBuilder.skip(skip).take(limit);

		// Execute query
		const [plans, total] = await queryBuilder.getManyAndCount();

		return {
			plans,
			total,
		};
	}
}
