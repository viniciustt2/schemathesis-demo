import { Reason } from '../../src/domain/value-objects/reason';

describe('[smoke] basic reason operations', () => {
	it('should create a reason and serialize', () => {
		expect.hasAssertions();
		const reason = Reason.create('FINISHED');
		const serialized = reason.serialize();
		expect(serialized).toMatchInlineSnapshot('"FINISHED"');
	});

	it('should handle empty reason and serialize', () => {
		expect.hasAssertions();
		const reason = Reason.create(undefined);
		const serialized = reason.serialize();
		expect(serialized).toMatchInlineSnapshot('undefined');
	});
});
