import { GetPlansDto } from '../dtos/get-plans.dto';

export class GetPlansQuery {
	constructor(public readonly getPlansDto: GetPlansDto) {}
}
