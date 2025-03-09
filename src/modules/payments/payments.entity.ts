import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';

export enum PaymentStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	FAILED = 'failed',
	CANCELED = 'canceled',
	REFUNDED = 'refunded',
}

export enum PaymentProvider {
	STRIPE = 'stripe',
	PAYPAL = 'paypal',
	MERCADOPAGO = 'mercadopago',
	PIX = 'pix',
	CREDIT_CARD = 'credit_card',
	BANK_SLIP = 'bank_slip',
	OTHER = 'other',
}

@Entity()
export class Payment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	userId: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column({ type: 'uuid', nullable: true })
	subscriptionId: string;

	@ManyToOne(() => Subscription, { nullable: true })
	@JoinColumn({ name: 'subscriptionId' })
	subscription: Subscription;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	amount: number;

	@Column({ length: 10 })
	currency: string;

	@Column({
		type: 'enum',
		enum: PaymentStatus,
		default: PaymentStatus.PENDING,
	})
	status: PaymentStatus;

	@Column({
		type: 'enum',
		enum: PaymentProvider,
	})
	provider: PaymentProvider;

	@Column({ length: 255, nullable: true })
	providerPaymentId: string;

	@Column({ length: 255, nullable: true })
	providerCustomerId: string;

	@Column({ type: 'jsonb', nullable: true })
	providerMetadata: Record<string, any>;

	@Column({ length: 255, nullable: true })
	description: string;

	@Column({ type: 'text', nullable: true })
	errorMessage: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;
}
