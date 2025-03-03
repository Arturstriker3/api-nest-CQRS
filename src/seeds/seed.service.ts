import { Injectable, Logger } from '@nestjs/common';
import { UserFactory } from './factories/user.factory';
import { PlanFactory } from './factories/plan.factory';

@Injectable()
export class SeedService {
	private readonly logger = new Logger(SeedService.name);

	constructor(
		private readonly userFactory: UserFactory,
		private readonly planFactory: PlanFactory,
	) {}

	async seed() {
		this.logger.log('🔄 Starting seed...');
		await this.userFactory.createSuperAdmin();
		await this.planFactory.createDefaultPlans();
		this.logger.log('🌱 Ended seed');
	}
}
