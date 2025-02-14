import type { Vehicle } from '../entities/vehicle';

export interface VehiclesRepository {
	list(): Promise<Vehicle[]>;
}
