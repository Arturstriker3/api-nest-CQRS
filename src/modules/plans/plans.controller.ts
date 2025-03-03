import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { IsAdmin } from '../auth/decorators/is-admin.decorator';
import {
	CreatePlanCommand,
	UpdatePlanCommand,
	DeletePlanCommand,
} from './commands';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { GetAllPlansQuery, GetPlanByIdQuery, GetPlansQuery } from './queries';
import { GetPlanByIdDto } from './dtos/get-plan-by-id.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { PlanResponseDto } from './dtos/plan-response.dto';
import { GetPlansDto } from './dtos/get-plans.dto';
import { PaginatedPlansResponseDto } from './dtos/paginated-plans-response.dto';
import {
	UserAccessLevel,
	apiSummaryWithAccess,
} from '../../common/utils/swagger.utils';

@ApiTags('Plans')
@ApiBearerAuth()
@Controller('plans')
export class PlansController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@ApiOperation({
		summary: apiSummaryWithAccess(
			'Get all plans with pagination',
			UserAccessLevel.PUBLIC,
		),
	})
	@ApiResponse({
		status: 200,
		description: 'Plans found',
		type: PaginatedPlansResponseDto,
	})
	async getPlans(@Query(ValidationPipe) query: GetPlansDto) {
		return this.queryBus.execute(new GetPlansQuery(query));
	}

	@Get('all')
	@ApiOperation({
		summary: apiSummaryWithAccess(
			'Get all active plans without pagination',
			UserAccessLevel.PUBLIC,
		),
	})
	@ApiResponse({
		status: 200,
		description: 'Plans found',
		type: [PlanResponseDto],
	})
	async getAllPlans() {
		return this.queryBus.execute(new GetAllPlansQuery());
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		summary: apiSummaryWithAccess('Get plan by id', UserAccessLevel.USER),
	})
	@ApiResponse({
		status: 200,
		description: 'Plan found',
		type: PlanResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Plan not found' })
	async getPlanById(@Param(ValidationPipe) params: GetPlanByIdDto) {
		return this.queryBus.execute(new GetPlanByIdQuery(params.id));
	}

	@Post()
	@IsAdmin()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@ApiOperation({
		summary: apiSummaryWithAccess('Create a new plan', UserAccessLevel.ADMIN),
	})
	@ApiBody({ type: CreatePlanDto })
	@ApiResponse({
		status: 201,
		description: 'Plan created',
		type: PlanResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
	@ApiResponse({
		status: 409,
		description: 'Conflict - Plan name already exists',
	})
	async createPlan(@Body(ValidationPipe) createPlanDto: CreatePlanDto) {
		return this.commandBus.execute(new CreatePlanCommand(createPlanDto));
	}

	@Patch(':id')
	@IsAdmin()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@ApiOperation({
		summary: apiSummaryWithAccess('Update a plan', UserAccessLevel.ADMIN),
	})
	@ApiBody({ type: UpdatePlanDto })
	@ApiResponse({
		status: 200,
		description: 'Plan updated',
		type: PlanResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
	@ApiResponse({ status: 404, description: 'Plan not found' })
	@ApiResponse({
		status: 409,
		description: 'Conflict - Plan name already exists',
	})
	async updatePlan(
		@Param(ValidationPipe) params: GetPlanByIdDto,
		@Body(ValidationPipe) updatePlanDto: UpdatePlanDto,
	) {
		return this.commandBus.execute(
			new UpdatePlanCommand(params.id, updatePlanDto),
		);
	}

	@Delete(':id')
	@IsAdmin()
	@UseGuards(JwtAuthGuard, AdminGuard)
	@HttpCode(204)
	@ApiOperation({
		summary: apiSummaryWithAccess('Delete a plan', UserAccessLevel.ADMIN),
	})
	@ApiResponse({ status: 204, description: 'Plan deleted' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
	@ApiResponse({ status: 404, description: 'Plan not found' })
	async deletePlan(@Param(ValidationPipe) params: GetPlanByIdDto) {
		await this.commandBus.execute(new DeletePlanCommand(params.id));
	}
}
