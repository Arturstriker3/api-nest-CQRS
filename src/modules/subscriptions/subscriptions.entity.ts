import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
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

	@Column({ type: 'int', nullable: true })
	maxProjects?: number;

	@Column({ type: 'timestamp', nullable: true })
	startsAt: Date;

	@Column({ type: 'timestamp', nullable: true })
	expiresAt?: Date;

	@Column({ type: 'boolean', default: true })
	isActive: boolean;

	@OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
