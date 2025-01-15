import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@ManyToOne(() => User, (user) => user.projects)
	owner: User;

	@DeleteDateColumn()
	deletedAt?: Date;
}
