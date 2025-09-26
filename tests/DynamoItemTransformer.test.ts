import { describe, it, expect, beforeAll } from "vitest";
import { fromDynamo, toDynamo } from "@/DynamoItemTransformer.js";

describe("DynamoItemTransformer", () => {
	let dynamoItem: Record<string, any>;
	let plainItem: Record<string, any>;

	beforeAll(() => {
		dynamoItem = {
			// Scalar types
			stringField: { S: "Hello" }, // String
			numberField: { N: "123" }, // Number (must be string in AttributeValue)
			booleanField: { BOOL: true }, // Boolean
			nullField: { NULL: true }, // Null
			binaryField: { B: new Uint8Array([1, 2, 3]) }, // Binary

			// Sets
			stringSet: { SS: ["a", "b", "c"] }, // String Set
			numberSet: { NS: ["1", "2", "3"] }, // Number Set (numbers as strings)
			binarySet: { BS: [new Uint8Array([1]), new Uint8Array([2])] }, // Binary Set

			// Complex types
			listField: {
				L: [
					// List
					{ S: "one" },
					{ N: "2" },
					{ BOOL: false },
				],
			},

			mapField: {
				M: {
					// Map
					nestedString: { S: "nested" },
					nestedNumber: { N: "99" },
					nestedList: { L: [{ S: "x" }, { N: "1" }] },
				},
			},
		};

		plainItem = {
			stringField: "Hello",
			numberField: 123,
			booleanField: true,
			nullField: null,
			binaryField: new Uint8Array([1, 2, 3]),

			stringSet: new Set(["a", "b", "c"]),
			numberSet: new Set([1, 2, 3]),
			binarySet: new Set([new Uint8Array([1]), new Uint8Array([2])]),

			listField: ["one", 2, false],

			mapField: {
				nestedString: "nested",
				nestedNumber: 99,
				nestedList: ["x", 1],
			},
			undefinedField: undefined,
		};
	});

	it("given a DynamoDB item, should transform to a plain object", () => {
		const result = fromDynamo(dynamoItem);
		expect(result).toEqual(plainItem);
	});

	it("given a plain object, should transform to a DynamoDB item", () => {
		const result = toDynamo(plainItem);
		expect(result).toEqual(dynamoItem);
	});
});
