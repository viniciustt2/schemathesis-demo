import { Coordinates } from '../../src/domain/value-objects/coordinates';

describe('[smoke] basic coordinate pair operations', () => {
	it('should create coordinate pair and serialize', () => {
		expect.hasAssertions();
		const coordinate = Coordinates.create({
			latitude: -2,
			longitude: 30,
		});
		const serialized = coordinate.serialize();
		expect(serialized).toMatchInlineSnapshot(`
			{
			  "latitude": -2,
			  "longitude": 30,
			}
		`);
	});
});
