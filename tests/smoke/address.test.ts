import { Address } from '../../src/domain/value-objects/address';

describe('[smoke] basic address operations', () => {
	it('should create an address and serialize', () => {
		expect.hasAssertions();
		const address = Address.create({
			state: 'SP',
			city: 'Sao Paulo',
			zipcode: '04026-000',
			number: '123',
			district: 'Vila Mariana',
			street: 'Rua Lorem Ipsum',
			complement: 'Entrada Sul',
			coordinate: { latitude: -2, longitude: 30 },
		});
		const serialized = address.serialize();
		expect(serialized).toMatchInlineSnapshot(`
			{
			  "city": "Sao Paulo",
			  "complement": "Entrada Sul",
			  "coordinate": {
			    "latitude": -2,
			    "longitude": 30,
			  },
			  "district": "Vila Mariana",
			  "number": "123",
			  "state": "SP",
			  "street": "Rua Lorem Ipsum",
			  "zipcode": "04026-000",
			}
		`);
	});
});
