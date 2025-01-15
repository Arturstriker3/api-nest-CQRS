import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	DeleteDateColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	OneToOne,
} from 'typeorm';
import { Project } from '../projects/projects.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Project, (project) => project.owner)
	projects: Project[];

	@OneToOne(() => Subscription, (subscription) => subscription.user, {
		cascade: true,
	})
	subscription: Subscription;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt?: Date;
}
