import { DateTime } from 'luxon';
import { Collection } from '../../domain/entities/collection';
import type { CollectionsRepository } from '../../domain/repositories/collections.repository';
import { CollectionPoint } from '../../domain/entities/collection-point';

export class CollectionsMockRepository implements CollectionsRepository {
	findById(id: string): Promise<Collection | null> {
		const collectionPoint = CollectionPoint.create({
			id: '5dc09bc6-f041-4275-9c7b-9b1f68666f1f',
			name: 'Edifício Itamarati',
			operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
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
				coordinate: {
					latitude: -1,
					longitude: 30,
				},
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
		});
		return Promise.resolve(
			Collection.create({
				id: id,
				collectionPoint: collectionPoint.serialize(),
				routeId: 'f7f16595-8537-486b-9027-ee419435980c',
				status: 'PENDING',
				volumeCollected: 0,
				date: DateTime.now(),
				startTime: undefined,
				endTime: undefined,
				notes: undefined,
			}),
		);
	}
}
