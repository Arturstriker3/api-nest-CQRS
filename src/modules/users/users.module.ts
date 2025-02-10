import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserController } from './users.controller';
import { GetUserByIdHandler } from './queries/get-user-by-id.query';
import { GetCurrentUserHandler } from './queries/get-current-user.query';

@Module({
	imports: [TypeOrmModule.forFeature([User]), CqrsModule],
	controllers: [UserController],
	providers: [GetUserByIdHandler, GetCurrentUserHandler],
})
export class UsersModule {}
