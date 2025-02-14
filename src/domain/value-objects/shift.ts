import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type ShiftEnum = z.infer<typeof Shift.schema>;
export class Shift {
	readonly value: ShiftEnum;

	static readonly enum = Object.freeze({
		MORNING: 'MORNING',
		AFTERNOON: 'AFTERNOON',
	});
	static readonly schema = z.nativeEnum(Shift.enum).openapi('Shift', {
		description: 'O turno de uma rota',
	});

	private constructor(shift: ShiftEnum) {
		this.value = shift;
	}

	static create(shift: ShiftEnum): Shift {
		return new Shift(shift);
	}

	static fromUnknown(unknown: unknown): Shift {
		const data = Shift.schema.parse(unknown);
		return new Shift(data);
	}

	static fromJSON(json: string | null): ShiftEnum[];
	static fromJSON(json: string | null): ShiftEnum;
	static fromJSON(json: string | null): ShiftEnum | ShiftEnum[] | undefined {
		if (!json) return undefined;
		const unknown = JSON.parse(json);

		if (Array.isArray(unknown)) {
			const data = z.array(Shift.schema).parse(unknown);
			return data;
		}

		const data = Shift.schema.parse(unknown);
		return data;
	}

	static toJSON(shift?: Shift | Shift[]): string {
		if (Array.isArray(shift)) {
			return JSON.stringify(shift.map(shift => shift.serialize()));
		}
		return JSON.stringify(shift?.serialize());
	}

	serialize() {
		return this.value;
	}
}
