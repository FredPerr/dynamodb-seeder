import { ConflictStrategy } from "@/ConflictStrategy.js";
import { DynamoSeedConfig, type ISeedConfig } from "@/SeedConfig.js";
import { describe, expect, test } from "vitest";

describe("SeedConfig", () => {
  const params: ISeedConfig = {
    region: "us-east-1",
    endpointUrl: "http://localhost:8000",
    environments: [
      {
        name: "Dev",
        tables: [
          {
            tableName: "TestTable",
            items: [
              {
                conflictStrategy: ConflictStrategy.Overwrite,
                data: { id: "0", name: "Item 0" },
                type: "TestEntity",
              },
              {
                conflictStrategy: ConflictStrategy.Overwrite,
                data: { id: "1", name: "Item 1" },
                type: "TestEntity",
              },
              {
                conflictStrategy: ConflictStrategy.Overwrite,
                data: { id: "2", name: "Item 2" },
                type: "TestEntity",
              },
            ],
            mappers: {
              TestEntity: (data: any) => ({
                pk: `TEST#${data.id}`,
                sk: `TEST#${data.id}`,
                name: data.name,
              }),
            },
          },
        ],
      },
    ],
  };

  test("given a valid config parameters, when creating an instance, then it should instantiate without errors", () => {
    expect(() => new DynamoSeedConfig(params)).not.toThrow();
  });
});
