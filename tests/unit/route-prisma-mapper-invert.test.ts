import { DateTime } from 'luxon';
import { Route } from '../../src/domain/entities/route';
import { RoutesPrismaMapper } from '../../src/infra/repositories/routes-prisma-repository';

type ToEntityInputType = Parameters<typeof RoutesPrismaMapper.toEntity>[0];
describe('Invert route prisma mapper', () => {
	beforeEach(() => {
		vi.useFakeTimers({ now: new Date('2025-01-06T10:20:30.000Z') });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be invertible', () => {
		const route = Route.create({
			name: 'Rota 1',
			date: DateTime.now(),
			totalDistanceKm: 10,
			totalTimeMs: 10000,
			collections: [
				{
					id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
					status: 'PENDING',
					date: DateTime.now(),
					volumeCollected: 0,
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					collectionPoint: {
						id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
						name: 'Edifício Itamarati',
						type: 'APARTMENT',
						status: 'ACTIVE',
						address: {
							state: 'SP',
							city: 'Sao Paulo',
							zipcode: '04026-000',
							number: '123',
							district: 'Vila Mariana',
							street: 'Rua Dolor Sit',
							complement: 'Entrada Norte',
							coordinate: { latitude: -8.059377, longitude: -34.886952 },
						},
						bestCollectionDay: ['FRIDAY'],
						selectiveCollectionDay: ['FRIDAY'],
						contact: {
							name: 'Matias Castro',
							role: 'ADMIN',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						},
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
					},
				},

				{
					id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
					status: 'PENDING',
					date: DateTime.now(),
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					volumeCollected: 0,
					collectionPoint: {
						id: '361754a6-845b-419b-8f96-be1f01fa899e',
						name: 'Edifício Residencial Lausanne',
						status: 'ACTIVE',
						address: {
							state: 'SP',
							city: 'Sao Paulo',
							zipcode: '04026-000',
							number: '123',
							district: 'Vila Mariana',
							street: 'Rua Lorem Ipsum',
							complement: 'Entrada Sul',
							coordinate: { latitude: -8.038912, longitude: -34.870932 },
						},
						bestCollectionDay: ['FRIDAY'],
						selectiveCollectionDay: ['FRIDAY'],
						contact: {
							name: 'Matias Castro',
							role: 'ADMIN',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						},
						type: 'APARTMENT',
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
					},
				},
			],
		});

		const inverse = RoutesPrismaMapper.fromEntity(route) as ToEntityInputType;

		const reverse = RoutesPrismaMapper.toEntity({
			...inverse,
			collections: [
				{
					id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
					status: 'PENDING',
					date: DateTime.now().toJSDate(),
					volumeCollected: 0,
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					collectionPointId: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
					startTime: null,
					endTime: null,
					notes: null,
					createdAt: DateTime.now().toJSDate(),
					updatedAt: DateTime.now().toJSDate(),
					collectionPoint: {
						id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
						name: 'Edifício Itamarati',
						type: 'APARTMENT',
						status: 'ACTIVE',
						address: JSON.stringify({
							state: 'SP',
							city: 'Sao Paulo',
							zipcode: '04026-000',
							number: '123',
							district: 'Vila Mariana',
							street: 'Rua Dolor Sit',
							complement: 'Entrada Norte',
							coordinate: { latitude: -8.059377, longitude: -34.886952 },
						}),
						bestCollectionDay: JSON.stringify(['FRIDAY']),
						selectiveCollectionDay: JSON.stringify(['FRIDAY']),
						contact: JSON.stringify({
							name: 'Matias Castro',
							role: 'ADMIN',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						}),
						relevantInfos: null,
						responsible: null,
						shifts: null,
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
						createdAt: DateTime.now().toJSDate(),
						updatedAt: DateTime.now().toJSDate(),
					},
				},

				{
					id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
					status: 'PENDING',
					date: DateTime.now().toJSDate(),
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					volumeCollected: 0,
					collectionPointId: '361754a6-845b-419b-8f96-be1f01fa899e',
					startTime: null,
					endTime: null,
					notes: null,
					createdAt: DateTime.now().toJSDate(),
					updatedAt: DateTime.now().toJSDate(),
					collectionPoint: {
						id: '361754a6-845b-419b-8f96-be1f01fa899e',
						name: 'Edifício Residencial Lausanne',
						type: 'APARTMENT',
						status: 'ACTIVE',
						address: JSON.stringify({
							state: 'SP',
							city: 'Sao Paulo',
							zipcode: '04026-000',
							number: '123',
							district: 'Vila Mariana',
							street: 'Rua Lorem Ipsum',
							complement: 'Entrada Sul',
							coordinate: { latitude: -8.038912, longitude: -34.870932 },
						}),
						bestCollectionDay: JSON.stringify(['FRIDAY']),
						selectiveCollectionDay: JSON.stringify(['FRIDAY']),
						contact: JSON.stringify({
							name: 'Matias Castro',
							role: 'ADMIN',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						}),
						relevantInfos: null,
						responsible: null,
						shifts: null,
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
						createdAt: DateTime.now().toJSDate(),
						updatedAt: DateTime.now().toJSDate(),
					},
				},
			],
		});
		expect(reverse.serialize()).toEqual(route.serialize());
	});
});
