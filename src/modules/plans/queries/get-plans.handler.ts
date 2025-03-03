import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../plans.entity';
import { GetPlansQuery } from './get-plans.query';
import { PaginatedResponseDto } from '../../../common/dtos/pagination.dto';

@QueryHandler(GetPlansQuery)
export class GetPlansHandler implements IQueryHandler<GetPlansQuery> {
	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async execute(query: GetPlansQuery): Promise<PaginatedResponseDto<Plan>> {
		const { getPlansDto } = query;
		const { page = 1, limit = 10, isActive } = getPlansDto;

		const skip = (page - 1) * limit;

		// Build where clause
		const whereClause: any = {};
		if (isActive !== undefined) {
			whereClause.isActive = isActive;
		}

		// Get total count
		const total = await this.planRepository.count({
			where: whereClause,
		});

		// Get plans
		const items = await this.planRepository.find({
			where: whereClause,
			skip,
			take: limit,
			order: {
				price: 'ASC',
			},
		});

		// Calculate pagination info
		const totalPages = Math.ceil(total / limit);
		const hasNext = page < totalPages;
		const hasPrevious = page > 1;

		return {
			items,
			total,
			page,
			limit,
			totalPages,
			hasNext,
			hasPrevious,
		};
	}
}
