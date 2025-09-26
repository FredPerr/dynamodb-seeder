import { ConflictStrategy } from "./ConflictStrategy.js";
import { seedDynamoDB } from "./DynamoSeed.js";

// ========= EntityType.ts =========
// enum EntityType {
// 	DemoEntity = "DemoEntity",
// }

export const EntityType = {
  DemoEntity: "DemoEntity",
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

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

// ============ Demo.ts ============
class Demo {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
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
                  data: new Demo("1", "Item 1"),
                  conflictStrategy: ConflictStrategy.Overwrite,
                  type: EntityType.DemoEntity,
                },
                {
                  data: new Demo("2", "Item 2"),
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
