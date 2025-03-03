import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_KEY } from '../decorators/is-admin.decorator';
import { UserRole } from '../../users/users.entity';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!isAdmin) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		if (user?.role !== UserRole.ADMIN) {
			throw new ForbiddenException('Only admins can access this resource.');
		}

		return true;
	}
}
