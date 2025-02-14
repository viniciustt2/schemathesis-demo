import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type RouteStatusEnum = z.infer<typeof RouteStatus.schema>;
export class RouteStatus {
	readonly value: RouteStatusEnum;

	static readonly enum = Object.freeze({ PENDING: 'PENDING', IN_PROGRESS: 'IN_PROGRESS', FINISHED: 'FINISHED' });
	static readonly list = Object.values(RouteStatus.enum);
	static readonly schema = z
		.nativeEnum(RouteStatus.enum)
		.openapi('RouteStatus', { description: 'O estado de uma rota de coleta de resíduo de vidro' });

	// Constructors
	private constructor(status: RouteStatusEnum) {
		this.value = status;
	}

	static create(status: RouteStatusEnum) {
		return new RouteStatus(status);
	}

	static pending() {
		return new RouteStatus(RouteStatus.enum.PENDING);
	}

	static inProgress() {
		return new RouteStatus(RouteStatus.enum.IN_PROGRESS);
	}

	static finished() {
		return new RouteStatus(RouteStatus.enum.FINISHED);
	}

	static fromUnknown(unknown: unknown): RouteStatus {
		const data = RouteStatus.schema.parse(unknown);
		return new RouteStatus(data);
	}

	// Status check shorthands
	isPending() {
		return this.value === RouteStatus.enum.PENDING;
	}

	// Serialization
	serialize() {
		return this.value;
	}
}
