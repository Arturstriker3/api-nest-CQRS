import { Injectable, NotFoundException } from '@nestjs/common';
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

	async updateUserCredits(userId: string, planId: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const plan = await this.planRepository.findOne({ where: { id: planId } });
		if (!plan) {
			throw new NotFoundException('Plan not found');
		}

		user.credits = plan.credits;
		const updatedUser = await this.userRepository.save(user);

		const subscription = this.subscriptionRepository.create({
			user: updatedUser,
			plan: plan,
		});

		await this.subscriptionRepository.save(subscription);

		return true;
	}
}
