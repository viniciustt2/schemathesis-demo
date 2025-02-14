import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type CoordinatesType = z.infer<typeof Coordinates.schema>;
export class Coordinates {
	readonly latitude: number;
	readonly longitude: number;

	static readonly schema = z
		.object({
			latitude: z.number().describe('latitude da coordenada'),
			longitude: z.number().describe('longitude da coordenada'),
		})
		.openapi('Coordinates', { description: 'coordenadas cartesianas' });

	private constructor(coordinates: CoordinatesType) {
		this.latitude = coordinates.latitude;
		this.longitude = coordinates.longitude;
	}

	static create(coordinates: CoordinatesType) {
		return new Coordinates(coordinates);
	}

	static maybeCreate(coordinate?: CoordinatesType): Coordinates | undefined {
		return coordinate ? Coordinates.create(coordinate) : undefined;
	}

	static fromUnknown(unknown: unknown): Coordinates {
		const data = Coordinates.schema.parse(unknown);
		return new Coordinates(data);
	}

	serialize() {
		return {
			latitude: this.latitude,
			longitude: this.longitude,
		};
	}
}
