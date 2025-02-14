import { collectionPointMock2 } from '../mocks/collection-points-mock';

describe('[smoke] basic collection point operations', () => {
	it('should create a collection point and serialize', () => {
		expect.hasAssertions();
		const serialized = collectionPointMock2.serialize();
		expect(serialized).toMatchInlineSnapshot(`{
  "address": {
    "city": "Sao Paulo",
    "complement": "Entrada Sul",
    "coordinate": {
      "latitude": -8.038912,
      "longitude": -34.870932,
    },
    "district": "Vila Mariana",
    "number": "123",
    "state": "SP",
    "street": "Rua Lorem Ipsum",
    "zipcode": "04026-000",
  },
  "bestCollectionDay": [
    "FRIDAY",
  ],
  "contact": {
    "email": "H9k5y@example.com",
    "name": "Matias Castro",
    "phone": "1234567890",
    "role": "ADMIN",
  },
  "id": "361754a6-845b-419b-8f96-be1f01fa899e",
  "name": "Edifício Residencial Lausanne",
  "operatorId": "738515b5-6cc1-4db7-b6fd-b24a8929a0d8",
  "responsible": undefined,
  "selectiveCollectionDay": [
    "FRIDAY",
  ],
  "shifts": undefined,
  "status": "ACTIVE",
  "type": "APARTMENT",
  "weeklyGlassVolume": 1000,
}
		`);
	});
});
