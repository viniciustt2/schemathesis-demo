import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type ResponsibleType = z.infer<typeof Responsible.schema>;
export class Responsible {
	readonly name?: string;
	readonly phone?: string;

	static readonly schema = z
		.object({
			name: z.string().optional().describe('Nome do responsável'),
			phone: z.string().optional().describe('Telefone do responsável'),
		})
		.openapi('Responsible', { description: 'Informações de contato do responsável' });

	private constructor(responsible: ResponsibleType) {
		this.name = responsible.name;
		this.phone = responsible.phone;
	}

	static create(responsible: ResponsibleType): Responsible {
		return new Responsible(responsible);
	}

	static maybeCreate(responsible?: ResponsibleType): Responsible | undefined {
		return responsible ? Responsible.create(responsible) : undefined;
	}

	static fromUnknown(unknown: unknown): Responsible {
		const data = Responsible.schema.parse(unknown);
		return new Responsible(data);
	}

	static fromJSON(json: string | null): Responsible | undefined {
		if (!json) return undefined;
		const unknown = JSON.parse(json);
		const data = Responsible.schema.parse(unknown);
		return new Responsible(data);
	}

	static toJSON(responsible: Responsible): string {
		return JSON.stringify(responsible.serialize());
	}

	serialize() {
		return {
			name: this.name,
			phone: this.phone,
		};
	}
}
