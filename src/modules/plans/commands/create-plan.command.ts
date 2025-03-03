import { CreatePlanDto } from '../dtos/create-plan.dto';

export class CreatePlanCommand {
	constructor(public readonly createPlanDto: CreatePlanDto) {}
}
