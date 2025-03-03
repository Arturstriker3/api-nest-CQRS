import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';

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

	@Column({ type: 'uuid', nullable: true })
	subscriptionId?: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	amount: number;

	@Column({ type: 'varchar', length: 10 })
	currency: string;

	@Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
	status: PaymentStatus;

	@Column({ type: 'enum', enum: PaymentProvider })
	provider: PaymentProvider;

	@Column({ type: 'varchar', length: 255, nullable: true })
	providerPaymentId?: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	providerCustomerId?: string;

	@Column({ type: 'jsonb', nullable: true })
	providerMetadata?: Record<string, any>;

	@Column({ type: 'varchar', length: 255, nullable: true })
	description?: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	errorMessage?: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;
}
