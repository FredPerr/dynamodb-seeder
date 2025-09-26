import { ConflictStrategy } from "@/ConflictStrategy.js";
import { SeedItem } from "@/SeedItem.js";
import { Table } from "@/Table.js";
import { describe, expect, test } from "vitest";

describe("SeedTable", () => {
	test("given valid parameters, when creating a SeedTable, then it should instantiate without errors", () => {
		let table: Table | undefined;

		expect(() => {
			table = new Table({ tableName: "test", items: [], mappers: {} });
		}).not.toThrow();

		expect(table).toBeInstanceOf(Table);
	});

	test("given a SeedTable with items, when getting the items count, then it should correspond to the number of items", () => {
		const item = new SeedItem({
			data: {},
			type: "t",
		});
		const table = new Table({
			mappers: {},
			tableName: "test",
			items: [item, item, item],
		});
		expect(table.getItemsCount()).toBe(3);
	});

	test("given a SeedTable with items of different conflict strategies, when getting the seed item batches, then it should return batches with the correct conflict strategies", () => {
		const item1 = new SeedItem({
			data: { id: 1 },
			type: "t",
			conflictStrategy: ConflictStrategy.Overwrite,
		});
		const item2 = new SeedItem({
			data: { id: 2 },
			type: "t",
			conflictStrategy: ConflictStrategy.Skip,
		});
		const item3 = new SeedItem({
			data: { id: 3 },
			type: "t",
			conflictStrategy: ConflictStrategy.Overwrite,
		});
		const table = new Table({
			tableName: "test",
			items: [item1, item2, item3],
			mappers: {},
		});
		const batches = table.getSeedItemBatches();

		const overwriteBatch = batches.find(
			(batch) => batch.conflictStrategy === ConflictStrategy.Overwrite,
		);
		const skipBatch = batches.find(
			(batch) => batch.conflictStrategy === ConflictStrategy.Skip,
		);

		expect(batches.length).toBe(2);
		expect(overwriteBatch).toBeDefined();
		expect(overwriteBatch?.items.length).toBe(2);
		expect(skipBatch).toBeDefined();
		expect(skipBatch?.items.length).toBe(1);
	});
});
