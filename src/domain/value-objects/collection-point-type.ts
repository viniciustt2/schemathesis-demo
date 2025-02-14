import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type CollectionPointTypeEnum = z.infer<typeof CollectionPointType.schema>;
export class CollectionPointType {
	readonly value: CollectionPointTypeEnum;

	static readonly enum = Object.freeze({ RESTAURANT: 'RESTAURANT', APARTMENT: 'APARTMENT' });
	static readonly schema = z.nativeEnum(CollectionPointType.enum).openapi('CollectionPointType', {
		description: 'O tipo de um ponto de coleta de coleta',
	});

	private constructor(type: CollectionPointTypeEnum) {
		this.value = type;
	}

	static create(type: CollectionPointTypeEnum) {
		return new CollectionPointType(type);
	}

	static fromUnknown(unknown: unknown): CollectionPointType {
		const data = CollectionPointType.schema.parse(unknown);
		return new CollectionPointType(data);
	}

	static fromJSON(json: string): CollectionPointType {
		const unknown = JSON.parse(json);
		const data = CollectionPointType.schema.parse(unknown);
		return new CollectionPointType(data);
	}

	serialize() {
		return this.value;
	}
}
