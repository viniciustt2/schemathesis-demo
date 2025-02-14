import type { VehiclesRepository } from '../../domain/repositories/vehicles-repository';
import { Vehicle } from '../../domain/entities/vehicle';
import type { PrismaClient, Vehicles as PrismaVehicle } from '@prisma/client';

export const VehiclesPrismaMapper = {
	/**
	 * Maps the domain entity into the prisma model
	 * @param entity A domain entity
	 * @returns A prisma create or update model
	 */
	fromEntity(entity: Vehicle): Omit<PrismaVehicle, 'createdAt' | 'updatedAt'> {
		return {
			id: entity.id,
			name: entity.name,
		};
	},
	/**
	 * Maps the prisma model into the domain entity
	 * @param model A model returned from prisma. It must be fully hydrated
	 * with all sub models.
	 * @returns The corresponding entity
	 */
	toEntity(model: PrismaVehicle): Vehicle {
		return Vehicle.create({
			id: model.id,
			name: model.name,
		});
	},
	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be
	 * fully hydrated with all sub models.
	 * @returns The converted list of entities
	 */
	toManyEntities(models: PrismaVehicle[]): Vehicle[] {
		return models.map(model => this.toEntity(model));
	},
};

export class VehiclesPrismaRepository implements VehiclesRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async list(): Promise<Vehicle[]> {
		const vehicles = await this.prisma.vehicles.findMany();
		return VehiclesPrismaMapper.toManyEntities(vehicles);
	}
}
