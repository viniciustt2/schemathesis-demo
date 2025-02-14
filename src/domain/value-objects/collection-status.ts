import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type CollectionStatusEnum = z.infer<typeof CollectionStatus.schema>;
export class CollectionStatus {
	readonly value: CollectionStatusEnum;

	static readonly enum = Object.freeze({ PENDING: 'PENDING', IN_PROGRESS: 'IN_PROGRESS', FINISHED: 'FINISHED' });
	static readonly list = Object.values(CollectionStatus.enum);
	static readonly schema = z.nativeEnum(CollectionStatus.enum).openapi('CollectionStatus', {
		description: 'O estado de uma coleta dentro de uma rota',
	});

	private constructor(status: CollectionStatusEnum) {
		this.value = status;
	}

	static create(status: CollectionStatusEnum) {
		return new CollectionStatus(status);
	}

	static fromUnknown(unknown: unknown): CollectionStatus {
		const data = CollectionStatus.schema.parse(unknown);
		return new CollectionStatus(data);
	}

	static inProgress() {
		return new CollectionStatus(CollectionStatus.enum.IN_PROGRESS);
	}

	static finished() {
		return new CollectionStatus(CollectionStatus.enum.FINISHED);
	}

	serialize() {
		return this.value;
	}
}
