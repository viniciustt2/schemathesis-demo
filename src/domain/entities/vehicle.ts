import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type VehicleType = z.infer<typeof Vehicle.schema>;
export class Vehicle {
	readonly id: string;
	readonly name: string;

	static readonly schema = z
		.object({
			id: z.string().uuid().describe('uuid4 do veículo'),
			name: z.string().describe('nome do veículo'),
		})
		.openapi('Vehicle', { description: 'Um veículo de coleta de vidro' });

	private constructor(vehicle: VehicleType) {
		this.id = vehicle.id;
		this.name = vehicle.name;
	}

	static create(vehicle: Optional<VehicleType, 'id'>) {
		return new Vehicle({
			id: vehicle.id ?? crypto.randomUUID(),
			name: vehicle.name,
		});
	}

	static fromUnknown(unknown: unknown): Vehicle {
		const data = Vehicle.schema.parse(unknown);
		return new Vehicle(data);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
		};
	}
}
