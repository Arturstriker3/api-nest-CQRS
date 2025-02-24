import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	FAILED = 'failed',
	CANCELED = 'canceled',
}

export enum PaymentProvider {
	STRIPE = 'stripe',
	PAYPAL = 'paypal',
	MERCADOPAGO = 'mercadopago',
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

	@CreateDateColumn()
	createdAt: Date;
}
