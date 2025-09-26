import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";

type DynamoMarshallable = AttributeValue | Record<string, AttributeValue>;
type PlainObject = Record<string, any>;

export function fromDynamo(item: DynamoMarshallable): PlainObject {
	return unmarshall(item);
}

export function toDynamo(item: PlainObject): DynamoMarshallable {
	return marshall(item, { removeUndefinedValues: true });
}
