import { UpdatePlanDto } from '../dtos/update-plan.dto';

export class UpdatePlanCommand {
	constructor(
		public readonly id: string,
		public readonly updatePlanDto: UpdatePlanDto,
	) {}
}
