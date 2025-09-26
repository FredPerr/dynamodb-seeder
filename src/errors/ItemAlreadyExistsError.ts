import { BaseError } from "./BaseError.js";

export class ItemAlreadyExistsError extends BaseError {
	public readonly tableName?: string;
	public readonly key?: string;

	constructor(
		message: string = "Item already exists",
		options?: {
			cause?: Error;
			statusCode?: number;
			tableName?: string;
			key?: string;
		},
	) {
		super(message, {
			cause: options?.cause,
			statusCode: options?.statusCode ?? 409,
			name: ItemAlreadyExistsError.name,
		});

		if (options?.tableName) {
			this.tableName = options.tableName;
		}
		if (options?.key) {
			this.key = options.key;
		}
	}
}
