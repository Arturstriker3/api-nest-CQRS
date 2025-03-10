import { CreatePlanHandler } from './create-plan.handler';
import { UpdatePlanHandler } from './update-plan.handler';
import { DeletePlanHandler } from './delete-plan.handler';
import { DeactivatePlanHandler } from './deactivate-plan.handler';

export const CommandHandlers = [
	CreatePlanHandler,
	UpdatePlanHandler,
	DeletePlanHandler,
	DeactivatePlanHandler,
];

export * from './create-plan.handler';
export * from './update-plan.handler';
export * from './delete-plan.handler';
export * from './deactivate-plan.handler';
