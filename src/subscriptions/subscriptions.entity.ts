import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
} from 'typeorm';
import { User } from '../users/users.entity';

export enum SubscriptionPlan {
	FREE = 'free',
	STANDARD = 'standard',
	PREMIUM = 'premium',
}

export const SubscriptionLimits: Record<SubscriptionPlan, number> = {
	[SubscriptionPlan.FREE]: 1,
	[SubscriptionPlan.STANDARD]: 5,
	[SubscriptionPlan.PREMIUM]: 20,
};

@Entity()
export class Subscription {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: SubscriptionPlan,
		default: SubscriptionPlan.FREE,
	})
	plan: SubscriptionPlan;

	@Column({ type: 'int', default: SubscriptionLimits[SubscriptionPlan.FREE] })
	maxProjects: number;

	@OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@BeforeInsert()
	setDefaultMaxProjects() {
		this.maxProjects = SubscriptionLimits[this.plan] ?? 1;
	}
}
