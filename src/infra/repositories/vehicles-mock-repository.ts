import type { VehiclesRepository } from '../../domain/repositories/vehicles-repository';
import { Vehicle } from '../../domain/entities/vehicle';

export class VehiclesMockRepository implements VehiclesRepository {
	async list(): Promise<Vehicle[]> {
		return [
			Vehicle.create({
				id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e',
				name: 'TRIVIM 1',
			}),
		];
	}
}
