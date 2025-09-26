import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import { Environment, type IEnvironment } from "./Environment.js";

export type EntityFactory<T = any> = (
	data: T,
) => Record<string, NativeAttributeValue>;

export interface ISeedConfig {
	/**
	 * Optional custom endpoint for DynamoDB (e.g. for local testing with DynamoDB Local)
	 */
	endpointUrl?: string;
	environments: IEnvironment[];
	region: string;
}

export class DynamoSeedConfig {
	readonly endpointUrl?: string;
	readonly environments: Environment[];
	readonly region: string;

	constructor(params: ISeedConfig) {
		this.endpointUrl = params.endpointUrl;
		this.environments = params.environments.map((env) => new Environment(env));
		this.region = params.region;
	}

	public getEnvironmentNames(): string[] {
		return this.environments.map((env) => env.name);
	}

	public getEnvironmentByName(name: string): Environment {
		const result = this.environments.find((env) => env.name === name);
		if (!result) {
			throw new Error(`Environment with name "${name}" not found`);
		}
		return result;
	}
}
