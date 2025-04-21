import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { Subscription } from '../subscriptions/subscriptions.entity';

@Entity()
export class Plan {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 100, unique: true })
	name: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	description: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	price: number;

	@Column({ type: 'integer' })
	credits: number;

	@Column({ type: 'boolean', default: true })
	isActive: boolean;

	@OneToMany(() => Subscription, (subscription) => subscription.plan)
	subscriptions: Subscription[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
