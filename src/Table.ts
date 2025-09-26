import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import type { ConflictStrategy } from "./ConflictStrategy.js";
import { type ISeedItem, SeedItem } from "./SeedItem.js";
import { SeedItemBatch } from "./SeedItemBatch.js";

const MAX_BATCH_WRITE_SIZE = 25;

export type EntityFactory<T = any> = (
  data: T
) => Record<string, NativeAttributeValue>;

type EntityTypeName = string;

export interface ITable {
  tableName: string;
  items: ISeedItem[];
  mappers: Record<EntityTypeName, EntityFactory>;
}

export class Table implements ITable {
  readonly tableName: string;
  readonly items: SeedItem[];
  readonly mappers: Record<EntityTypeName, EntityFactory>;

  constructor(params: ITable) {
    this.tableName = params.tableName;
    this.items = params.items.map((item) => new SeedItem(item));
    this.mappers = params.mappers;
  }

  public getItemsCount(): number {
    return this.items.length;
  }

  public getSeedItemBatches(): SeedItemBatch[] {
    const itemsMap = this.buildItemsMapPerStrategy(this.items);
    const batchesMap = this.buildItemsBatchesPerStrategy(itemsMap);
    return Array.from(batchesMap.values()).flat();
  }

  public getMappers(): Record<EntityTypeName, EntityFactory> {
    return this.mappers;
  }

  private buildItemsMapPerStrategy(
    items: SeedItem[]
  ): Map<ConflictStrategy, SeedItem[]> {
    const map = new Map<ConflictStrategy, SeedItem[]>();
    for (const item of items) {
      const strategy = item.conflictStrategy;
      if (!map.has(strategy)) {
        map.set(strategy, []);
      }
      // biome-ignore lint/style/noNonNullAssertion: we just set it
      map.get(strategy)!.push(item);
    }
    return map;
  }

  private buildItemsBatchesPerStrategy(
    itemsMap: Map<ConflictStrategy, SeedItem[]>
  ): Map<ConflictStrategy, SeedItemBatch[]> {
    const batchesMap = new Map<ConflictStrategy, SeedItemBatch[]>();
    for (const [strategy, items] of itemsMap.entries()) {
      const chunks = this.chunkItems(items, MAX_BATCH_WRITE_SIZE);
      const batches = chunks.map((chunk) => new SeedItemBatch(chunk, strategy));
      batchesMap.set(strategy, batches);
    }
    return batchesMap;
  }

  private chunkItems<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
