import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../../modules/plans/plans.entity';

@Injectable()
export class PlanFactory {
	private readonly logger = new Logger(PlanFactory.name);

	constructor(
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	async createDefaultPlans(): Promise<void> {
		const plansCount = await this.planRepository.count();

		if (plansCount > 0) {
			this.logger.log('✅ Plans Factory: Default plans already exist');
			return;
		}

		// Create default plans
		const freePlan = this.planRepository.create({
			name: 'Free',
			description: 'Free plan with basic features',
			price: 0,
			maxProjects: 1,
			durationDays: 0, // no expiration
			isActive: true,
		});

		const basicPlan = this.planRepository.create({
			name: 'Basic',
			description: 'Basic plan for beginners',
			price: 5.99,
			maxProjects: 5,
			durationDays: 30,
			isActive: true,
		});

		const proPlan = this.planRepository.create({
			name: 'Professional',
			description: 'Plan for advanced users',
			price: 11.99,
			maxProjects: 15,
			durationDays: 30,
			isActive: true,
		});

		const premiumPlan = this.planRepository.create({
			name: 'Premium',
			description: 'Premium plan with unlimited resources',
			price: 19.99,
			maxProjects: 30,
			durationDays: 30,
			isActive: true,
		});

		await this.planRepository.save([freePlan, basicPlan, proPlan, premiumPlan]);

		this.logger.log('✅ Plans Factory: Default plans created successfully');
	}
}
