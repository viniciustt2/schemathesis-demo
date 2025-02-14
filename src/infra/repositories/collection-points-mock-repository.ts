import type { CollectionPointsRepository } from '../../domain/repositories/collection-points-repository';
import { CollectionPointStatus } from '../../domain/value-objects/collection-point-status';
import { CollectionPoint } from '../../domain/entities/collection-point';
import type { CollectionPointFiltersType } from '../../domain/value-objects/filters';

export class CollectionPointsMockRepository implements CollectionPointsRepository {
	#collectionPoints: CollectionPoint[] = [
		CollectionPoint.create({
			id: '361754a6-845b-419b-8f96-be1f01fa899e',
			name: 'Edifício Residencial Lausanne',
			status: CollectionPointStatus.enum.ACTIVE,
			address: {
				city: 'Sao Paulo',
				district: 'Vila Mariana',
				number: '123',
				state: 'SP',
				zipcode: '04026-000',
				street: 'Rua Lorem Ipsum',
				complement: 'Entrada Sul',
				coordinate: { latitude: -2, longitude: 30 },
			},
			bestCollectionDay: ['FRIDAY'],
			selectiveCollectionDay: ['FRIDAY'],
			contact: {
				name: 'Matias Castro',
				role: 'ADMIN',
				phone: '1234567890',
				email: 'H9k5y@example.com',
			},
			type: 'APARTMENT',
			weeklyGlassVolume: 1000,
			operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
		}),
		CollectionPoint.create({
			id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
			name: 'Edifício Itamarati',
			status: CollectionPointStatus.enum.ACTIVE,
			address: {
				city: 'Sao Paulo',
				district: 'Vila Mariana',
				number: '123',
				state: 'SP',
				zipcode: '04026-000',
				street: 'Rua Dolor Sit',
				complement: 'Entrada Norte',
				coordinate: { latitude: -1, longitude: 30 },
			},
			bestCollectionDay: ['FRIDAY'],
			selectiveCollectionDay: ['FRIDAY'],
			contact: {
				name: 'Matias Castro',
				role: 'ADMIN',
				phone: '1234567890',
				email: 'H9k5y@example.com',
			},
			type: 'APARTMENT',
			weeklyGlassVolume: 1000,
			operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
		}),
	];
	async count(_filters: CollectionPointFiltersType): Promise<number> {
		return this.#collectionPoints.length;
	}
	async save(_collectionPoint: CollectionPoint): Promise<void> {
		return;
	}
	async getById(collectionPointId: string): Promise<CollectionPoint> {
		switch (collectionPointId) {
			case '361754a6-845b-419b-8f96-be1f01fa899e':
				return CollectionPoint.create({
					id: '361754a6-845b-419b-8f96-be1f01fa899e',
					name: 'Edifício Residencial Lausanne',
					status: CollectionPointStatus.enum.ACTIVE,
					address: {
						city: 'Sao Paulo',
						district: 'Vila Mariana',
						number: '123',
						state: 'SP',
						zipcode: '04026-000',
						street: 'Rua Lorem Ipsum',
						complement: 'Entrada Sul',
						coordinate: { latitude: -2, longitude: 30 },
					},
					bestCollectionDay: ['FRIDAY'],
					selectiveCollectionDay: ['FRIDAY'],
					contact: {
						name: 'Matias Castro',
						role: 'ADMIN',
						phone: '1234567890',
						email: 'H9k5y@example.com',
					},
					type: 'APARTMENT',
					weeklyGlassVolume: 1000,
					operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
				});
			case '97f2ab4c-ef96-42a5-9da8-395f236c875e':
				return CollectionPoint.create({
					id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
					name: 'Edifício Itamarati',
					status: CollectionPointStatus.enum.ACTIVE,
					address: {
						city: 'Sao Paulo',
						district: 'Vila Mariana',
						number: '123',
						state: 'SP',
						zipcode: '04026-000',
						street: 'Rua Dolor Sit',
						complement: 'Entrada Norte',
						coordinate: { latitude: -1, longitude: 30 },
					},
					bestCollectionDay: ['FRIDAY'],
					selectiveCollectionDay: ['FRIDAY'],
					contact: {
						name: 'Matias Castro',
						role: 'ADMIN',
						phone: '1234567890',
						email: 'H9k5y@example.com',
					},
					type: 'APARTMENT',
					weeklyGlassVolume: 1000,
					operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
				});
			default:
				return Promise.reject(null);
		}
	}

	async list(_filters: CollectionPointFiltersType): Promise<CollectionPoint[]> {
		return this.#collectionPoints;
	}
}
