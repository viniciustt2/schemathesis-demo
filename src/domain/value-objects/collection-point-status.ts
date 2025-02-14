import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type CollectionPointStatusEnum = z.infer<typeof CollectionPointStatus.schema>;
export class CollectionPointStatus {
	readonly value: CollectionPointStatusEnum;

	static readonly enum = Object.freeze({ ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' });
	static readonly list = Object.values(CollectionPointStatus.enum);
	static readonly schema = z.nativeEnum(CollectionPointStatus.enum).openapi('CollectionPointStatus', {
		description: 'O estado de um ponto de coleta de coleta de resíduo de vidro dentro de uma rota',
	});

	private constructor(status: CollectionPointStatusEnum) {
		this.value = status;
	}

	static create(status: CollectionPointStatusEnum) {
		return new CollectionPointStatus(status);
	}

	static fromUnknown(unknown: unknown): CollectionPointStatus {
		const data = CollectionPointStatus.schema.parse(unknown);
		return new CollectionPointStatus(data);
	}

	static active() {
		return new CollectionPointStatus(CollectionPointStatus.enum.ACTIVE);
	}

	static inactive() {
		return new CollectionPointStatus(CollectionPointStatus.enum.INACTIVE);
	}

	serialize() {
		return this.value;
	}
}
