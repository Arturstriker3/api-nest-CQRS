import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user-decorator';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { GetSubscriptionResponseDto } from './dtos/get-subscription-response.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import {
	GetUserSubscriptionQuery,
	GetSubscriptionByUserIdQuery,
} from './queries';
import { UpdateSubscriptionCommand } from './commands';
import {
	apiSummaryWithAccess,
	UserAccessLevel,
} from 'src/common/utils/swagger.utils';
import { IsAdmin } from '../auth/decorators/is-admin.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		summary: apiSummaryWithAccess(
			'Get current user subscription',
			UserAccessLevel.USER,
		),
	})
	@ApiResponse({
		status: 200,
		description: 'Subscription found',
		type: GetSubscriptionResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Subscription not found' })
	async getUserSubscription(@CurrentUser() user: any) {
		return this.queryBus.execute(new GetUserSubscriptionQuery(user.id));
	}

	@Get('user/:id')
	@UseGuards(JwtAuthGuard, AdminGuard)
	@IsAdmin()
	@ApiOperation({
		summary: apiSummaryWithAccess(
			'Get subscription by user ID',
			UserAccessLevel.ADMIN,
		),
	})
	@ApiResponse({
		status: 200,
		description: 'Subscription found',
		type: GetSubscriptionResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Subscription not found' })
	async getSubscriptionByUserId(@Param('userId') userId: string) {
		return this.queryBus.execute(new GetSubscriptionByUserIdQuery(userId));
	}

	@Patch('user/:id')
	@UseGuards(JwtAuthGuard, AdminGuard)
	@IsAdmin()
	@ApiOperation({
		summary: apiSummaryWithAccess(
			'Update current user subscription',
			UserAccessLevel.ADMIN,
		),
	})
	@ApiResponse({
		status: 200,
		description: 'Subscription updated',
		type: GetSubscriptionResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Subscription not found' })
	async updateUserSubscription(
		@Body() updateSubscriptionDto: UpdateSubscriptionDto,
		@CurrentUser() user: any,
	) {
		return this.commandBus.execute(
			new UpdateSubscriptionCommand(user.id, updateSubscriptionDto),
		);
	}
}
