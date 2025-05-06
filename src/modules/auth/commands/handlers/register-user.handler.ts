import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/users.entity';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';
import { RegisterUserCommand } from '../register-user.command';
import { RegisterUserResponseDto } from '../../dtos/register-user-response.dto';
import { SubscriptionsService } from '../../../subscriptions/subscriptions.service';
import { Plan } from '../../../plans/plans.entity';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
	implements ICommandHandler<RegisterUserCommand>
{
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly commandBus: CommandBus,
		private readonly subscriptionsService: SubscriptionsService,
		@InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
	) {}

	async execute(command: RegisterUserCommand): Promise<RegisterUserResponseDto> {
		const { name, email, password } = command.data;

		const existingUser = await this.userRepository.findOne({ where: { email } });
		if (existingUser) {
			throw new ConflictException(`This email is already taken`);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const freePlan = await this.planRepository.findOne({
			where: { name: 'Free', isActive: true },
		});

		if (!freePlan) {
			throw new Error('Free plan not found');
		}

		const user = this.userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		const savedUser = await this.userRepository.save(user);

		await this.subscriptionsService.updateUserCredits(savedUser.id, freePlan.id);

		return new RegisterUserResponseDto(savedUser);
	}
}
