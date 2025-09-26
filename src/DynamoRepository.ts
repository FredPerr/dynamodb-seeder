import {
  DynamoDBClient,
  PutItemCommand,
  ConditionalCheckFailedException,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ItemAlreadyExistsError } from "./errors/ItemAlreadyExistsError.js";
import type { SeedItemBatch } from "./SeedItemBatch.js";

export interface BaseKeys {
  pk: string;
  sk?: string;
  [key: string]: string | undefined; // allow other keys like gsi1pk, gsi1sk, etc.
}

export type DynamoItem<T extends {}> = BaseKeys & T;

export interface CreateItemOptions<T extends {}> {
  tableName: string;
  item: DynamoItem<T>;
}

export class DynamoRepository {
  private client: DynamoDBClient;

  constructor(region: string) {
    this.client = new DynamoDBClient({ region });
    console.log("DynamoDB Client region:", this.client.config.region);
  }

  async putItem<T extends {}>(options: CreateItemOptions<T>): Promise<void> {
    const { tableName, item } = options;

    const marshalled = marshall(item, { removeUndefinedValues: true });

    await this.client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: marshalled,
      })
    );
  }

  async createItem<T extends {}>(options: CreateItemOptions<T>): Promise<void> {
    const { tableName, item } = options;

    const marshalled = marshall(item, { removeUndefinedValues: true });

    try {
      await this.client.send(
        new PutItemCommand({
          TableName: tableName,
          Item: marshalled,
          ConditionExpression:
            "attribute_not_exists(pk) AND attribute_not_exists(sk)",
        })
      );
    } catch (err) {
      if (err instanceof ConditionalCheckFailedException) {
        throw new ItemAlreadyExistsError("Item already exists", {
          tableName,
          key: `pk=${item.pk}, sk=${item.sk ?? "∅"}`,
        });
      }
      throw err;
    }
  }

  async createBatch(tableName: string, batch: SeedItemBatch): Promise<void> {
    const marshalledItems = batch.items.map((item) =>
      marshall(item.data, { removeUndefinedValues: true })
    );

    console.debug(
      `Creating batch of ${marshalledItems.length} items in table ${tableName}`
    );

    console.log("DynamoDB Client region:", this.client.config.region);
    const response = await this.client.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: marshalledItems.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      })
    );

    for (const unprocessedTableName of Object.keys(
      response.UnprocessedItems || {}
    )) {
      const unprocessedItems =
        response.UnprocessedItems?.[unprocessedTableName];
      console.warn(
        `Warning: ${unprocessedItems?.length} items were not processed in table ${unprocessedTableName}.`
      );
    }
  }
}
