import {
	Controller,
	Post,
	Body,
	Logger,
	ValidationPipe,
	UseGuards,
	HttpCode,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';
import { PaymentResponseDto } from './dtos/payment-response.dto';
import { CreatePaymentIntentCommand } from './commands/create-payment-intent.command';
import {
	apiSummaryWithAccess,
	UserAccessLevel,
} from '../../common/utils/swagger.utils';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user-decorator';
import { CurrentUserDto } from '../auth/dtos/current-user.dto';
import { VerifyPaymentIntentDto } from './dtos/verify-payment-intent.dto';
import { VerifyPaymentIntentCommand } from './commands/verify-payment-intent.command';
import { PaymentVerificationResponseDto } from './dtos/payment-verification-response.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
	private readonly logger = new Logger(PaymentsController.name);

	constructor(private readonly commandBus: CommandBus) {}

	@Post('create-intent')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		summary: apiSummaryWithAccess('Create payment intent', UserAccessLevel.USER),
	})
	@ApiResponse({
		status: 201,
		description: 'Payment intent created',
		type: PaymentResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Token missing or invalid',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found or Plan not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Invalid data, such as unsupported currency',
	})
	@ApiResponse({
		status: 500,
		description:
			'Internal server error - Error processing payment or communicating with Stripe',
	})
	async createPaymentIntent(
		@Body(ValidationPipe) createPaymentIntentDto: CreatePaymentIntentDto,
		@CurrentUser() user: CurrentUserDto,
	): Promise<PaymentResponseDto> {
		const userIdToUse = user.id;

		this.logger.log(
			`Creating payment intent for user: ${userIdToUse}, plan: ${createPaymentIntentDto.planId}`,
		);

		return this.commandBus.execute(
			new CreatePaymentIntentCommand(
				userIdToUse,
				createPaymentIntentDto.planId,
				createPaymentIntentDto.description,
				undefined, // provider (default: stripe)
				createPaymentIntentDto.metadata,
			),
		);
	}

	@Post('verify-intent')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@ApiOperation({
		summary: apiSummaryWithAccess(
			'Verificar payment intent',
			UserAccessLevel.USER,
		),
	})
	@ApiResponse({
		status: 200,
		description: 'Payment intent verified',
		type: PaymentVerificationResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Missing or invalid token',
	})
	@ApiResponse({
		status: 404,
		description: 'Payment intent not found',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Invalid data',
	})
	@ApiResponse({
		status: 500,
		description: 'Internal server error - Error processing verification',
	})
	async verifyPaymentIntent(
		@Body(ValidationPipe) verifyPaymentIntentDto: VerifyPaymentIntentDto,
		@CurrentUser() user: CurrentUserDto,
	): Promise<PaymentVerificationResponseDto> {
		this.logger.log(
			`Verifying payment intent: ${verifyPaymentIntentDto.paymentIntentId || verifyPaymentIntentDto.paymentId} for user: ${user.id}`,
		);

		return this.commandBus.execute(
			new VerifyPaymentIntentCommand(
				verifyPaymentIntentDto.paymentIntentId,
				verifyPaymentIntentDto.paymentId,
			),
		);
	}
}
