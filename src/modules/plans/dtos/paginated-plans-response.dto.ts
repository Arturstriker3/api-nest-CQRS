import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../../common/dtos/pagination.dto';
import { PlanResponseDto } from './plan-response.dto';

export class PaginatedPlansResponseDto extends PaginatedResponseDto<PlanResponseDto> {
	@ApiProperty({
		description: 'Array of plans',
		type: [PlanResponseDto],
	})
	items: PlanResponseDto[];
}
