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
		try {
			this.logger.log('🔄 Starting seed...');
			await this.planFactory.createDefaultPlans();
			await this.userFactory.createSuperAdmin();
			this.logger.log('🌱 Seed completed successfully');
		} catch (error) {
			this.logger.error(`❌ Seed failed: ${error.message}`);
			throw error;
		}
	}
}
