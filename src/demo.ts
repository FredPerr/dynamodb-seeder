import { ConflictStrategy } from "./ConflictStrategy.js";
import { seedDynamoDB } from "./DynamoSeed.js";

// ========= EntityType.ts =========
enum EntityType {
	DemoEntity = "DemoEntity",
}
// =================================

// ========= DemoEntity.ts =========
// ...
export function toDemoEntity(item: any) {
	return {
		PK: `DEMO#${item.id}`,
		SK: `DEMO#${item.id}`,
		name: item.name,
		_et: EntityType.DemoEntity,
	};
}
// =================================

export default async function ({ env }: { env?: string[] }) {
	await seedDynamoDB({
		environmentName: env ?? true,
		config: {
			// endpointUrl: "http://localhost:8000",
			region: "ca-central-1",
			environments: [
				{
					name: "demo-env",
					tables: [
						{
							tableName: "dynamodb-seeder-demo",
							items: [
								{
									data: { id: "1", name: "Item 1" },
									conflictStrategy: ConflictStrategy.Overwrite,
									type: EntityType.DemoEntity,
								},
								{
									data: { id: "2", name: "Item 2" },
									conflictStrategy: ConflictStrategy.Overwrite,
									type: EntityType.DemoEntity,
								},
							],
							mappers: {
								[EntityType.DemoEntity]: toDemoEntity,
							},
						},
					],
				},
			],
		},
	});
}
