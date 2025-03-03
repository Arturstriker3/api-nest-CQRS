import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { UserFactory } from './factories/user.factory';
import { User } from '../modules/users/users.entity';
import { Plan } from '../modules/plans/plans.entity';
import { PlanFactory } from './factories/plan.factory';

@Module({
	imports: [TypeOrmModule.forFeature([User, Plan]), ConfigModule],
	providers: [SeedService, UserFactory, PlanFactory],
	exports: [SeedService],
})
export class SeedModule {}
