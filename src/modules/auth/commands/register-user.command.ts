import { RegisterUserDto } from '../dtos/register-user.dto';

export class RegisterUserCommand {
	constructor(public readonly data: RegisterUserDto) {}
}
