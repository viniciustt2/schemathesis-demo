import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type ReasonEnum = z.infer<typeof Reason.schema>;

export class Reason {
	readonly value: ReasonEnum;

	static readonly enum = Object.freeze({ FINISHED: 'FINISHED' });
	static readonly list = Object.values(Reason.enum);

	static readonly schema = z
		.nativeEnum(Reason.enum)
		.optional()
		.openapi('Reason', { description: 'Motivo associado ao fim da rota' });

	private constructor(reason: ReasonEnum) {
		this.value = reason;
	}

	static create(reason: ReasonEnum) {
		return new Reason(reason);
	}

	static fromUnknown(unknown: unknown): Reason {
		const data = Reason.schema.parse(unknown);
		return new Reason(data);
	}

	serialize() {
		return this.value;
	}
}
