import { ConflictStrategy } from "@/ConflictStrategy.js";
import { SeedItem } from "@/SeedItem.js";
import { describe, test, expect, beforeAll } from "vitest";

describe("SeedItem", () => {
	type DomainType = { id: string };
	const type = "TestType";
	let data: DomainType;

	beforeAll(() => {
		data = { id: "123" };
	});

	test("given valid parameters, when constructing, then should create instance with attributes without throwing", () => {
		let item: SeedItem<DomainType> | undefined;

		expect(() => {
			item = new SeedItem({
				data,
				type,
				conflictStrategy: ConflictStrategy.Skip,
			});
		}).not.toThrow();

		expect(item).toBeInstanceOf(SeedItem);
		expect(item?.data).toBe(data);
		expect(item?.type).toBe(type);
		expect(item?.conflictStrategy).toBe(ConflictStrategy.Skip);
	});

	test("given minimal valid parameters, when constructing, then should create instance with default attributes without throwing", () => {
		let item: SeedItem | undefined;

		expect(() => {
			item = new SeedItem({
				data,
				type,
			});
		}).not.toThrow();
		expect(item?.conflictStrategy).toBe(ConflictStrategy.Overwrite);
	});
});
