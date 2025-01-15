import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

function ensureEnvVar(name: string): string {
	if (!process.env[name]) {
		throw new Error(`❌ Missing environment variable: ${name}`);
	}
	return process.env[name];
}

export default registerAs('auth', () => ({
	jwtSecret: ensureEnvVar('JWT_SECRET'),
	accessTokenExpiration: ensureEnvVar('JWT_ACCESS_EXPIRATION'),
	refreshTokenExpiration: ensureEnvVar('JWT_REFRESH_EXPIRATION'),
}));
