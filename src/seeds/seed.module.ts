import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { UserFactory } from './factories/user.factory';
import { User } from '../modules/users/users.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), ConfigModule],
	providers: [SeedService, UserFactory],
	exports: [SeedService],
})
export class SeedModule {}
