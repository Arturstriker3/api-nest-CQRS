import { GetAllPlansHandler } from './get-all-plans.handler';
import { GetPlanByIdHandler } from './get-plan-by-id.handler';
import { GetPlansHandler } from './get-plans.handler';

export const QueryHandlers = [
	GetAllPlansHandler,
	GetPlanByIdHandler,
	GetPlansHandler,
];

export * from './get-all-plans.handler';
export * from './get-plan-by-id.handler';
export * from './get-plans.handler';
