import { LoginUserDto } from '../dtos/login-user.dto';

export class LoginUserCommand {
	constructor(public readonly data: LoginUserDto) {}
}
