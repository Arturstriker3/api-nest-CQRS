import {
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Plan } from '../plans/plans.entity';

@Entity()
export class Subscription {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Plan, (plan) => plan.subscriptions)
	@JoinColumn()
	plan: Plan;

	@OneToOne(() => User, (user) => user.subscriptions, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
