import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../modules/users/users.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { SubscriptionsService } from '../../modules/subscriptions/subscriptions.service';

@Injectable()
export class UserFactory {
	private readonly logger = new Logger(UserFactory.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly subscriptionsService: SubscriptionsService,
	) {}

	async createSuperAdmin(): Promise<void> {
		const email = this.configService.get<string>('SUPER_ADMIN_EMAIL');
		const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

		if (!email || !password) {
			this.logger.error(
				'⚠️ Users Factory: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD envs are required',
			);
			return;
		}

		const existingUser = await this.userRepository.findOne({ where: { email } });
		if (existingUser) {
			this.logger.log('✅ Users Factory: Super Admin already exist');
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const superAdmin = this.userRepository.create({
			name: 'Super Admin',
			email,
			password: hashedPassword,
			role: UserRole.ADMIN,
			credits: 999999999,
		});

		await this.userRepository.save(superAdmin);

		this.logger.log('✅ Users Factory: Super Admin created successfully');
	}
}
