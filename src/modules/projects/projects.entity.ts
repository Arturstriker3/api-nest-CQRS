import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	DeleteDateColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'varchar', length: 1024 })
	description: string;

	@ManyToOne(() => User, (user) => user.projects)
	owner: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamp' })
	deletedAt?: Date;
}
