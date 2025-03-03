import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserController } from './users.controller';
import { QueryHandlers } from './queries/handlers';

@Module({
	imports: [TypeOrmModule.forFeature([User]), CqrsModule],
	controllers: [UserController],
	providers: [...QueryHandlers],
})
export class UsersModule {}
