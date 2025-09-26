import { BaseError } from "./BaseError.js";

export class ConfigValidationError extends BaseError {
	constructor(
		message: string = "Config validation error",
		options?: {
			cause?: Error;
			statusCode?: number;
		},
	) {
		super(message, {
			cause: options?.cause,
			statusCode: options?.statusCode ?? 409,
			name: ConfigValidationError.name,
		});
	}
}
