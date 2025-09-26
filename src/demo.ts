import { ConflictStrategy } from "./ConflictStrategy.js";
import { seedDynamoDB } from "./DynamoSeed.js";

async function main() {
  await seedDynamoDB({
    environmentName: "demo-env",
    config: {
      region: "us-east-1",
      endpointUrl: "http://localhost:8000",
      environments: [
        {
          name: "demo-env",
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
                DemoEntity: (item) => ({
                  PK: `DEMO#${item.id}`,
                  SK: `DEMO#${item.id}`,
                  name: item.name,
                  _et: "DemoEntity",
                }),
              },
            },
          ],
        },
      ],
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed");
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
