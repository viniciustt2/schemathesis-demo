import { DateTime } from 'luxon';
import { Route } from '../../src/domain/entities/route';
import { RouteStatus } from '../../src/domain/value-objects/route-status';
import { collectionPointMock1 } from '../mocks/collection-points-mock';

describe('[smoke] basic routes operations', () => {
	it('should create a route and serialize', () => {
		expect.hasAssertions();
		const fixedDate = DateTime.fromISO('2025-02-06T22:17:03.196+00:00');
		const route = Route.create({
			id: 'f7f16595-8537-486b-9027-ee419435980c',
			name: 'Rota 1',
			date: DateTime.fromISO('2024-12-16T12:00:00.000'),
			totalDistanceKm: 40,
			totalTimeMs: 1000 * 60 * 60 * 4,
			status: RouteStatus.enum.PENDING,
			collections: [
				{
					id: '361754a6-845b-419b-8f96-be1f01fa899e',
					collectionPoint: collectionPointMock1.serialize(),
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					status: 'PENDING',
					date: fixedDate,
					volumeCollected: 0,
				},
			],
		});
		const serialized = route.serialize();
		expect(serialized).toMatchInlineSnapshot(`{
  "collections": [
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
    },
  ],
  "comment": undefined,
  "date": "2024-12-16T12:00:00.000Z",
  "executor": undefined,
  "finishedAt": undefined,
  "id": "f7f16595-8537-486b-9027-ee419435980c",
  "name": "Rota 1",
  "reason": undefined,
  "startedAt": undefined,
  "status": "PENDING",
  "totalDistanceKm": 40,
  "totalTimeMs": 14400000,
}`);
	});
});
