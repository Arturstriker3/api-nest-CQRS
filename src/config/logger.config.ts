import { LoggerService } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export class CustomLogger implements LoggerService {
	private static contexRules: Record<string, number> = {};
	private readonly LOG_LEVEL_MAP: Record<string, number> = {
		trace: 0,
		debug: 1,
		info: 2,
		warn: 3,
		error: 4,
	};

	constructor(@InjectPinoLogger() private readonly logger: PinoLogger) {
		if (Object.keys(CustomLogger.contexRules).length === 0) {
			this.initializeContextRules();
		}
	}

	verbose(message: string, context?: string) {
		if (this.shouldLog('trace', context)) {
			this.logger.trace({ context }, message);
		}
	}

	debug(message: string, context?: string) {
		if (this.shouldLog('debug', context)) {
			this.logger.debug({ context }, message);
		}
	}

	log(message: string, context?: string) {
		if (this.shouldLog('info', context)) {
			this.logger.info({ context }, message);
		}
	}

	warn(message: string, context?: string) {
		if (this.shouldLog('warn', context)) {
			this.logger.warn({ context }, message);
		}
	}

	error(message: string, context?: string) {
		if (this.shouldLog('error', context)) {
			this.logger.error({ context }, message);
		}
	}

	private initializeContextRules() {
		const globalLogLevel = process.env.LOG_LEVEL?.trim() || 'info';
		CustomLogger.contexRules['*'] =
			this.LOG_LEVEL_MAP[globalLogLevel] ?? this.LOG_LEVEL_MAP['info'];

		const contextRules = process.env.LOG_CONTEXTS;
		if (contextRules) {
			const rules = contextRules.split(',');
			for (const rule of rules) {
				const [context, level] = rule.split('=').map((s) => s.trim());
				if (context && level && this.LOG_LEVEL_MAP[level]) {
					CustomLogger.contexRules[context] = this.LOG_LEVEL_MAP[level];
				}
			}
		}
	}

	private getLogLevel(context?: string): number {
		context = context || '';

		if (CustomLogger.contexRules[context] !== undefined) {
			return CustomLogger.contexRules[context];
		}

		return CustomLogger.contexRules['*'];
	}

	private shouldLog(methodLevel: string, context: string): boolean {
		const methodLevelNum = this.LOG_LEVEL_MAP[methodLevel];
		const currentLevelNum = this.getLogLevel(context);

		// console.log(
		// 	`🧐 Checking log level: method=${methodLevel} (${methodLevelNum}), context=${context}, allowed=${currentLevelNum}`,
		// );

		return methodLevelNum >= currentLevelNum;
	}
}
