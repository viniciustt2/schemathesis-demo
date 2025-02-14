import { Collection } from '../../src/domain/entities/collection';
import { CollectionStatus } from '../../src/domain/value-objects/collection-status';
import { DateTime } from 'luxon';
import { collectionPointMock1 } from '../mocks/collection-points-mock';

describe('[smoke] basic collection operations', () => {
	it('should create a collection and serialize', () => {
		expect.hasAssertions();
		const fixedDate = DateTime.fromISO('2025-02-06T22:17:03.196+00:00');
		const collection = Collection.create({
			id: '361754a6-845b-419b-8f96-be1f01fa899e',
			collectionPoint: collectionPointMock1.serialize(),
			routeId: 'f7f16595-8537-486b-9027-ee419435980c',
			status: CollectionStatus.enum.PENDING,
			date: fixedDate,
			volumeCollected: 0,
		});
		const serialized = collection.serialize();
		expect(serialized).toMatchInlineSnapshot(`
            {
              "collectionPoint": {
    "address": {
      "city": "Sao Paulo",
      "complement": "Entrada Norte",
      "coordinate": {
        "latitude": -8.059377,
        "longitude": -34.886952,
      },
      "district": "Vila Mariana",
      "number": "123",
      "state": "SP",
      "street": "Rua Dolor Sit",
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
    "id": "97f2ab4c-ef96-42a5-9da8-395f236c875e",
    "name": "Edifício Itamarati",
    "operatorId": "738515b5-6cc1-4db7-b6fd-b24a8929a0d8",
    "responsible": undefined,
    "selectiveCollectionDay": [
      "FRIDAY",
    ],
    "shifts": undefined,
    "status": "ACTIVE",
    "type": "APARTMENT",
    "weeklyGlassVolume": 1000,
  },
              "date": "2025-02-06T22:17:03.196+00:00",
              "endTime": undefined,
              "id": "361754a6-845b-419b-8f96-be1f01fa899e",
              "notes": undefined,
              "routeId": "f7f16595-8537-486b-9027-ee419435980c",
              "startTime": undefined,
              "status": "PENDING",
              "volumeCollected": 0,
            }
        `);
	});
});
