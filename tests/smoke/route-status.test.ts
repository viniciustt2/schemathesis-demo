import { RouteStatus } from '../../src/domain/value-objects/route-status';

describe('[smoke] basic route status operations', () => {
	it('should create a route status and serialize', () => {
		expect.hasAssertions();
		const status = RouteStatus.create(RouteStatus.enum.PENDING);
		const serialized = status.serialize();
		expect(serialized).toMatchInlineSnapshot(`"PENDING"`);
	});

	it('should be able to have routes in progress', () => {
		expect.hasAssertions();
		const status = RouteStatus.create(RouteStatus.enum.IN_PROGRESS);
		const serialized = status.serialize();
		expect(serialized).toMatchInlineSnapshot(`"IN_PROGRESS"`);
	});
});
