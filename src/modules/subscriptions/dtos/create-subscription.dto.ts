import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
	@IsUUID()
	@IsNotEmpty()
	planId: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	startsAt?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	expiresAt?: Date;
}
