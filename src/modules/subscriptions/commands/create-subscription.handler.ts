import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../subscriptions.entity';
import { CreateSubscriptionCommand } from './create-subscription.command';
import { Plan } from '../../plans/plans.entity';
import { User } from '../../users/users.entity';
import { addDays } from 'date-fns';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
	implements ICommandHandler<CreateSubscriptionCommand>
{
	constructor(
		@InjectRepository(Subscription)
		private readonly subscriptionRepository: Repository<Subscription>,
		@InjectRepository(Plan)
		private readonly planRepository: Repository<Plan>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async execute(command: CreateSubscriptionCommand): Promise<Subscription> {
		const { createSubscriptionDto, userId } = command;
		const { planId, startsAt, expiresAt } = createSubscriptionDto;

		// Check if the plan exists
		const plan = await this.planRepository.findOne({
			where: { id: planId, isActive: true },
		});

		if (!plan) {
			throw new NotFoundException(`Plan with ID ${planId} not found or inactive`);
		}

		// Check if the user exists
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['subscription'],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}

		const currentDate = new Date();
		const subscriptionStartDate = startsAt || currentDate;
		const subscriptionEndDate =
			expiresAt ||
			(plan.durationDays
				? addDays(subscriptionStartDate, plan.durationDays)
				: null);

		// If user already has a subscription, update it
		if (user.subscription) {
			user.subscription.plan = plan;
			user.subscription.maxProjects = plan.maxProjects;
			user.subscription.startsAt = subscriptionStartDate;
			user.subscription.expiresAt = subscriptionEndDate;
			user.subscription.isActive = true;

			return this.subscriptionRepository.save(user.subscription);
		}

		// Create new subscription
		const subscription = this.subscriptionRepository.create({
			plan,
			maxProjects: plan.maxProjects,
			startsAt: subscriptionStartDate,
			expiresAt: subscriptionEndDate,
			isActive: true,
			user,
		});

		return this.subscriptionRepository.save(subscription);
	}
}
