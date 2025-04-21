import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	DeleteDateColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { Project } from '../projects/projects.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin',
}

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	email: string;

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@OneToMany(() => Project, (project) => project.owner)
	projects: Project[];

	@OneToMany(() => Subscription, (subscription) => subscription.user)
	subscriptions: Subscription[];

	@Column({ type: 'integer', default: 0 })
	credits: number;

	@Column({ type: 'varchar', length: 512, nullable: true })
	refreshToken: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;
}
