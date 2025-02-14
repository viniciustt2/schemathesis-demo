import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type WeekdayEnum = z.infer<typeof Weekday.schema>;
export type ExtendedWeekdayEnum = z.infer<typeof Weekday.extendedSchema>;
export class Weekday {
	readonly value: WeekdayEnum;

	static readonly enum = Object.freeze({
		MONDAY: 'MONDAY',
		TUESDAY: 'TUESDAY',
		WEDNESDAY: 'WEDNESDAY',
		THURSDAY: 'THURSDAY',
		FRIDAY: 'FRIDAY',
	});

	static readonly extendedEnum = Object.freeze({
		...Weekday.enum,
		WEEKEND: 'WEEKEND',
		NOANSWER: 'NOANSWER',
	});

	static readonly schema = z.nativeEnum(Weekday.enum).openapi('Weekday', {
		description: 'Um dia da semana válido',
	});

	static readonly extendedSchema = z.nativeEnum(Weekday.extendedEnum).openapi('ExtendedWeekday', {
		description: 'Um dia da semana incluindo o fim de semana, ou sem informação',
	});

	private constructor(weekday: WeekdayEnum) {
		this.value = weekday;
	}

	static create(weekday: WeekdayEnum): Weekday {
		return new Weekday(weekday);
	}
	static maybeCreate(weekday: WeekdayEnum[] | undefined): Weekday[] | undefined {
		if (!weekday) return undefined;
		return weekday.map(day => (day ? Weekday.create(day as WeekdayEnum) : undefined)).filter(day => day !== undefined);
	}

	static createExtended(weekday: ExtendedWeekdayEnum): Weekday {
		if (weekday === 'NOANSWER' || weekday === 'WEEKEND') {
			throw new Error(`Cannot create a Weekday instance with "${weekday}". Use ExtendedWeekday instead.`);
		}
		return new Weekday(weekday);
	}
	static maybeCreateExtended(weekday: ExtendedWeekdayEnum[] | undefined): Weekday[] | undefined {
		if (!weekday) return undefined;
		return weekday.map(day => (day ? Weekday.createExtended(day) : undefined)).filter(day => day !== undefined);
	}

	static fromJSON(json: string | null): WeekdayEnum[];
	static fromJSON(json: string | null): WeekdayEnum;
	static fromJSON(json: string | null): WeekdayEnum | WeekdayEnum[] | undefined {
		if (!json) return undefined;
		const unknown = JSON.parse(json);

		if (Array.isArray(unknown)) {
			const data = z.array(Weekday.schema).parse(unknown);
			return data;
		}

		const data = Weekday.schema.parse(unknown);
		return data;
	}

	static fromJSONWithUnknown(json: string | null): ExtendedWeekdayEnum[];
	static fromJSONWithUnknown(json: string | null): ExtendedWeekdayEnum;
	static fromJSONWithUnknown(json: string | null): ExtendedWeekdayEnum | ExtendedWeekdayEnum[] | undefined {
		if (!json) return undefined;
		const unknown = JSON.parse(json);

		if (Array.isArray(unknown)) {
			const data = z.array(Weekday.extendedSchema).parse(unknown);
			return data;
		}

		const data = Weekday.extendedSchema.parse(unknown);
		return data;
	}

	static toJSON(weekDay?: Weekday | Weekday[]): string {
		if (Array.isArray(weekDay)) {
			return JSON.stringify(weekDay.map(day => day.serialize()));
		}
		return JSON.stringify(weekDay?.serialize());
	}

	serialize() {
		return this.value;
	}
}
