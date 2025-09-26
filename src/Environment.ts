import { type ITable, Table } from "./Table.js";

export interface IEnvironment {
	name: string;
	tables: ITable[];
}

export class Environment implements IEnvironment {
	readonly name: string;
	readonly tables: Table[];

	constructor(params: IEnvironment) {
		this.name = params.name;
		this.tables = params.tables.map((table) => new Table(table));
	}
}
