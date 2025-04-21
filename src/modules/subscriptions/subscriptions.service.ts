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
}
