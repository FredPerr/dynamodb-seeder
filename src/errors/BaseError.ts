export class BaseError extends Error {
	public readonly name: string;
	public readonly cause?: Error;
	public readonly statusCode?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			statusCode?: number;
			name?: string;
		},
	) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = options?.name ?? new.target.name;
		this.cause = options?.cause;
		this.statusCode = options?.statusCode;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
