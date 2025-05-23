import {
	Entity,
	PrimaryGeneratedColumn,
	OneToOne,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Plan } from '../plans/plans.entity';
import { Payment } from '../payments/payments.entity';

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

	@OneToOne(() => Payment)
	@JoinColumn({ name: 'paymentId' })
	payment: Payment;

	@Column({ type: 'uuid', nullable: true })
	paymentId: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
