import { CollectionStatus } from '../../src/domain/value-objects/collection-status';

describe('[smoke] basic collection status operations', () => {
	it('should create a collection status and serialize', () => {
		expect.hasAssertions();
		const status = CollectionStatus.create(CollectionStatus.enum.PENDING);
		const serialized = status.serialize();
		expect(serialized).toMatchInlineSnapshot(`"PENDING"`);
	});
});
