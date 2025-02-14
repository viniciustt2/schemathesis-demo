import { CollectionPointStatus } from '../../src/domain/value-objects/collection-point-status';

describe('[smoke] basic collection point status operations', () => {
	it('should create a collection point status and serialize', () => {
		expect.hasAssertions();
		const status = CollectionPointStatus.create(CollectionPointStatus.enum.ACTIVE);
		const serialized = status.serialize();
		expect(serialized).toMatchInlineSnapshot(`"ACTIVE"`);
	});
});
