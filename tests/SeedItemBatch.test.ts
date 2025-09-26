import { ConflictStrategy } from "@/ConflictStrategy.js";
import { SeedItem } from "@/SeedItem.js";
import { SeedItemBatch } from "@/SeedItemBatch.js";
import { describe, expect, test } from "vitest";

describe("SeedItemBatch", () => {
  test("given valid parameters, when creating a SeedItemBatch, then it should instantiate without errors", () => {
    let batch: SeedItemBatch | undefined;

    expect(() => {
      batch = new SeedItemBatch([], ConflictStrategy.Overwrite);
    }).not.toThrow();

    expect(batch).toBeInstanceOf(SeedItemBatch);
  });

  test("given a SeedItemBatch with items, when checking its properties, then it should contain the provided items", () => {
    const items: SeedItem[] = [
      new SeedItem({
        data: {},
        type: "t",
      }),
      new SeedItem({
        data: {},
        type: "t",
      }),
    ];
    const batch = new SeedItemBatch(items, ConflictStrategy.Overwrite);

    expect(batch).toBeDefined();
    expect(batch.items).toEqual(items);
    expect(batch.conflictStrategy).toBe(ConflictStrategy.Overwrite);
  });
});
