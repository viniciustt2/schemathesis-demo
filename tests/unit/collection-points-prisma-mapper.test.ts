import { CollectionPointsPrismaMapper } from '../../src/infra/repositories/collection-points-prisma-repository';
import { collectionPointMock1 } from '../mocks/collection-points-mock';

type ToEntityInputType = Parameters<typeof CollectionPointsPrismaMapper.toEntity>[0];
describe('Invert collection point prisma mapper', () => {
	it('should be invertible', () => {
		const inverse = CollectionPointsPrismaMapper.fromEntity(collectionPointMock1) as ToEntityInputType;
		const reverse = CollectionPointsPrismaMapper.toEntity(inverse);
		expect(reverse.serialize()).toEqual(collectionPointMock1.serialize());
	});
});
