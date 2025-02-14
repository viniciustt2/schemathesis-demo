import { DateTime } from 'luxon';
import { Collection } from '../../src/domain/entities/collection';
import { CollectionsPrismaMapper } from '../../src/infra/repositories/collections-prisma-repository';
import { collectionPointPrismaMock1, collectionPointMock1 } from '../mocks/collection-points-mock';

type ToEntityInputType = Parameters<typeof CollectionsPrismaMapper.toEntity>[0];
describe('Invert collection prisma mapper', () => {
	it('should be invertible', () => {
		const collection = Collection.create({
			collectionPoint: collectionPointMock1.serialize(),
			date: DateTime.now(),
			routeId: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
			status: 'PENDING',
			volumeCollected: 1000,
			notes: 'Test notes',
		});

		const inverse = CollectionsPrismaMapper.fromEntity(collection) as ToEntityInputType;

		const reverse = CollectionsPrismaMapper.toEntity({
			...inverse,
			collectionPoint: collectionPointPrismaMock1,
		});

		expect(reverse.serialize()).toEqual(collection.serialize());
	});
});
