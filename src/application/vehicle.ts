import type { VehiclesRepository } from '../domain/repositories/vehicles-repository';

export class VehicleService {
	constructor(private repository: VehiclesRepository) {}

	async list() {
		const vehicles = await this.repository.list();
		return vehicles.map(vehicle => vehicle.serialize());
	}
}
