import { Vehicle } from '../../src/domain/entities/vehicle';

describe('[smoke] basic vehicles operations', () => {
	it('should create a vehicle and serialize', () => {
		expect.hasAssertions();
		const vehicle = Vehicle.create({
			id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e',
			name: 'TRIVIM 1',
		});
		const serialized = vehicle.serialize();
		expect(serialized).toMatchInlineSnapshot(`
			{
			  "id": "ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e",
			  "name": "TRIVIM 1",
			}
		`);
	});
});
