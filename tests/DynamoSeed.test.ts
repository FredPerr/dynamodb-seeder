import { ConflictStrategy } from "@/ConflictStrategy.js";
import { seedDynamoDB } from "@/DynamoSeed.js";
import { describe, it, expect } from "vitest";

const LOCAL_DYNAMODB_ENDPOINT = "http://localhost:8000";

describe("DynamoSeed", () => {
	it("given single environment, when calling seedDynamoDB, then it should seed given environment", async () => {
		expect(async () => {
			await seedDynamoDB({
				environmentName: "demo-env",
				config: {
					region: "us-east-1",
					endpointUrl: LOCAL_DYNAMODB_ENDPOINT,
					environments: [
						{
							name: "demo-env",
							tables: [
								{
									tableName: "DemoTable",
									items: [],
									mappers: {},
								},
							],
						},
					],
				},
			});
		}).not.toThrow();
	});

	it("given multiple environments, when calling seedDynamoDB with true, then it should seed all environments", async () => {
		expect(async () => {
			await seedDynamoDB({
				environmentName: true,
				config: {
					region: "us-east-1",
					endpointUrl: LOCAL_DYNAMODB_ENDPOINT,
					environments: [
						{
							name: "demo-env-1",
							tables: [
								{
									tableName: "DemoTable",
									items: [],
									mappers: {},
								},
							],
						},
						{
							name: "demo-env-2",
							tables: [
								{
									tableName: "DemoTable",
									items: [],
									mappers: {},
								},
							],
						},
					],
				},
			});
		}).not.toThrow();
	});

	it("given multiple environments, when calling seedDynamoDB with array of environment names, then it should seed specified environments", async () => {
		expect(async () => {
			await seedDynamoDB({
				environmentName: ["demo-env-1", "demo-env-2"],
				config: {
					region: "us-east-1",
					endpointUrl: LOCAL_DYNAMODB_ENDPOINT,
					environments: [
						{
							name: "demo-env-1",
							tables: [
								{
									tableName: "DemoTable",
									items: [],
									mappers: {},
								},
							],
						},
						{
							name: "demo-env-2",
							tables: [
								{
									tableName: "DemoTable",
									items: [],
									mappers: {},
								},
							],
						},
					],
				},
			});
		}).not.toThrow();
	});

	it("given single environment with items, when calling seedDynamoDB, then it should seed the environment", async () => {
		expect(async () => {
			await seedDynamoDB({
				environmentName: "demo-env-1",
				config: {
					region: "us-east-1",
					endpointUrl: LOCAL_DYNAMODB_ENDPOINT,
					environments: [
						{
							name: "demo-env-1",
							tables: [
								{
									tableName: "DemoTable",
									items: [
										{
											data: { id: "1", name: "Item 1" },
											conflictStrategy: ConflictStrategy.Overwrite,
											type: "DemoEntity",
										},
										{
											data: { id: "2", name: "Item 2" },
											conflictStrategy: ConflictStrategy.Overwrite,
											type: "DemoEntity",
										},
									],
									mappers: {
										DemoEntity: (data: any) => {
											return {
												...data,
												pk: `DEMO#${data.id}`,
												sk: `DEMO#${data.id}`,
											};
										},
									},
								},
							],
						},
					],
				},
			});
		}).not.toThrow();
	});
});
