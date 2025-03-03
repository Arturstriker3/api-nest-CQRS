import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetCurrentUserHandler } from './get-current-user.handler';

export const QueryHandlers = [GetUserByIdHandler, GetCurrentUserHandler];

export * from './get-user-by-id.handler';
export * from './get-current-user.handler';
