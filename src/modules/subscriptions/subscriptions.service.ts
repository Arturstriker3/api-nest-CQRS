import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscriptions.entity';
import { User } from '../users/users.entity';
import { Plan } from '../plans/plans.entity';

@Injectable()
export class SubscriptionsService {
	constructor(
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
	) {}

	/**
	 * Cria uma assinatura padrão para um novo usuário
	 * @param userId ID do usuário para criar a assinatura
	 * @returns A assinatura criada
	 */
	async createDefaultSubscription(userId: string): Promise<Subscription> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}

		const existingSubscription = await this.subscriptionRepository.findOne({
			where: { user: { id: userId } },
		});

		if (existingSubscription) {
			throw new ConflictException(`User already has an active subscription`);
		}

		const planName = 'Free';

		const defaultPlan = await this.planRepository.findOne({
			where: { name: planName },
		});

		if (!defaultPlan) {
			throw new NotFoundException(
				`${planName} plan not found. Please ensure a plan with name "${planName}" exists in the database`,
			);
		}

		const subscription = this.subscriptionRepository.create({
			user,
			plan: defaultPlan,
			startsAt: new Date(),
			// No need to set expiresAt
		});

		return this.subscriptionRepository.save(subscription);
	}
}
