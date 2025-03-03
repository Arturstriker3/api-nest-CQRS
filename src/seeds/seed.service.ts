import { Injectable, Logger } from '@nestjs/common';
import { UserFactory } from './factories/user.factory';

@Injectable()
export class SeedService {
	private readonly logger = new Logger(SeedService.name);

	constructor(private readonly userFactory: UserFactory) {}

	async seed() {
		this.logger.log('🔄 Starting seed...');
		await this.userFactory.createSuperAdmin();
		this.logger.log('✅ Ended seed');
	}
}
