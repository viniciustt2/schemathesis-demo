import { DateTime } from 'luxon';
import { Route } from '../../domain/entities/route';
import type { RoutesRepository } from '../../domain/repositories/routes-repository';
import { RouteStatus } from '../../domain/value-objects/route-status';

export class RoutesMockRepository implements RoutesRepository {
	constructor(private hasRoutes?: boolean) {}
	async getById(id: string): Promise<Route | null> {
		if (id !== 'f7f16595-8537-486b-9027-ee419435980c') return null;
		return Route.create({
			id: 'f7f16595-8537-486b-9027-ee419435980c',
			name: 'Rota 1',
			date: DateTime.fromISO('2024-12-16T12:00:00.000Z'),
			collections: [
				{
					id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
					status: 'PENDING',
					date: DateTime.now(),
					volumeCollected: 0,
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					collectionPoint: {
						id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
						name: 'Edifício Itamarati',
						status: 'ACTIVE',
						type: 'APARTMENT',
						address: {
							city: 'Sao Paulo',
							district: 'Vila Mariana',
							number: '123',
							state: 'SP',
							zipcode: '04026-000',
							street: 'Rua Dolor Sit',
							complement: 'Entrada Norte',
							coordinate: { latitude: -8.059377, longitude: -34.886952 },
						},
						bestCollectionDay: ['FRIDAY'],
						selectiveCollectionDay: ['FRIDAY'],
						contact: {
							name: 'Matias Castro',
							role: 'ADMIN',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						},
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
					},
				},

				{
					id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
					status: 'PENDING',
					date: DateTime.now(),
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					volumeCollected: 0,
					collectionPoint: {
						id: '361754a6-845b-419b-8f96-be1f01fa899e',
						name: 'Edifício Residencial Lausanne',
						type: 'APARTMENT',
						status: 'ACTIVE',
						address: {
							city: 'Sao Paulo',
							district: 'Vila Mariana',
							number: '123',
							state: 'SP',
							zipcode: '04026-000',
							street: 'Rua Lorem Ipsum',
							complement: 'Entrada Sul',
							coordinate: { latitude: -8.038912, longitude: -34.870932 },
						},
						bestCollectionDay: ['FRIDAY'],
						selectiveCollectionDay: ['FRIDAY'],
						contact: {
							name: 'Matias Castro',
							role: 'ADMIN',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						},
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
					},
				},
			],
			totalDistanceKm: 40,
			totalTimeMs: 1000 * 60 * 60 * 4,
			status: RouteStatus.enum.PENDING,
		});
	}

	list(): Promise<Route[]> {
		return Promise.resolve([
			Route.create({
				id: 'f7f16595-8537-486b-9027-ee419435980c',
				name: 'Rota 1',
				date: DateTime.fromISO('2024-12-16T12:00:00.000Z'),
				collections: [
					{
						id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
						status: 'PENDING',
						date: DateTime.now(),
						volumeCollected: 0,
						routeId: 'f7f16595-8537-486b-9027-ee419435980c',
						collectionPoint: {
							id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
							name: 'Edifício Itamarati',
							status: 'ACTIVE',
							address: {
								city: 'Sao Paulo',
								district: 'Vila Mariana',
								number: '123',
								state: 'SP',
								zipcode: '04026-000',
								street: 'Rua Dolor Sit',
								complement: 'Entrada Norte',
								coordinate: { latitude: -8.059377, longitude: -34.886952 },
							},
							type: 'APARTMENT',
							bestCollectionDay: ['FRIDAY'],
							selectiveCollectionDay: ['FRIDAY'],
							contact: {
								name: 'Matias Castro',
								role: 'ADMIN',
								phone: '1234567890',
								email: 'H9k5y@example.com',
							},
							weeklyGlassVolume: 1000,
							operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
						},
					},

					{
						id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
						status: 'PENDING',
						date: DateTime.now(),
						routeId: 'f7f16595-8537-486b-9027-ee419435980c',
						volumeCollected: 0,
						collectionPoint: {
							id: '361754a6-845b-419b-8f96-be1f01fa899e',
							name: 'Edifício Residencial Lausanne',
							status: 'ACTIVE',
							address: {
								city: 'Sao Paulo',
								district: 'Vila Mariana',
								number: '123',
								state: 'SP',
								zipcode: '04026-000',
								street: 'Rua Lorem Ipsum',
								complement: 'Entrada Sul',
								coordinate: { latitude: -8.038912, longitude: -34.870932 },
							},
							type: 'APARTMENT',
							bestCollectionDay: ['FRIDAY'],
							selectiveCollectionDay: ['FRIDAY'],
							contact: {
								name: 'Matias Castro',
								role: 'ADMIN',
								phone: '1234567890',
								email: 'H9k5y@example.com',
							},
							weeklyGlassVolume: 1000,
							operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
						},
					},
				],
				totalDistanceKm: 40,
				totalTimeMs: 1000 * 60 * 60 * 4,
				status: RouteStatus.enum.PENDING,
			}),
		]);
	}

	async save(_route: Route): Promise<void> {
		return;
	}

	async hasRoutesInProgressByUser(_userId: string): Promise<boolean> {
		return this.hasRoutes ?? true;
	}
}
