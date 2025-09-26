import { ConflictStrategy } from "./ConflictStrategy.js";

export interface ISeedItem<DomainType = any> {
	type: string;
	data: DomainType;
	conflictStrategy?: ConflictStrategy;
}

export class SeedItem<DomainType = any> {
	public readonly data: DomainType;
	public readonly type: string;
	public readonly conflictStrategy: ConflictStrategy;

	constructor(params: ISeedItem<DomainType>) {
		this.data = params.data;
		this.type = params.type;
		this.conflictStrategy =
			params.conflictStrategy ?? ConflictStrategy.Overwrite;
	}
}
