import type { ConflictStrategy } from "./ConflictStrategy.js";
import type { SeedItem } from "./SeedItem.js";

export class SeedItemBatch {
  public readonly items: SeedItem[];
  public readonly conflictStrategy: ConflictStrategy;

  constructor(
    items: SeedItem[],
    conflictStrategy: ConflictStrategy
  ) {
    this.items = items;
    this.conflictStrategy = conflictStrategy;
  }
}
