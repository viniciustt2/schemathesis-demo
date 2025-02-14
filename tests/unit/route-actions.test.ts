import { DateTime } from 'luxon';
import { Route } from '../../src/domain/entities/route';
import { User } from '../../src/domain/entities/user';
import { RouteStatus } from '../../src/domain/value-objects/route-status';
import { collectionPointMock1, collectionPointMock2 } from '../mocks/collection-points-mock';

describe('[unit] Route actions', () => {
	const now = new Date('2024-12-20T10:20:30.000Z');

	beforeEach(() => {
		vi.useFakeTimers({ now });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	// PET-167
	it('should start a route', () => {
		expect.hasAssertions();
		const user = User.create({ fullName: 'John Doe', initials: 'JD' });
		const route = Route.create({
			name: 'Rota 1',
			date: DateTime.fromISO('2024-12-16T12:00:00.000'),
			totalDistanceKm: 40,
			totalTimeMs: 14400000,
			collections: [
				{
					id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
					status: 'PENDING',
					date: DateTime.now(),
					volumeCollected: 0,
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					collectionPoint: collectionPointMock1.serialize(),
				},
				{
					id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
					status: 'PENDING',
					date: DateTime.now(),
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					volumeCollected: 0,
					collectionPoint: collectionPointMock2.serialize(),
				},
			],
		});

		route.start(user);
		expect(route.executor).toBe(user);
		expect(route.startedAt?.toJSDate()).toEqual(now);
	});

	// PET-172
	it('should finish a route', () => {
		expect.hasAssertions();
		const route = Route.create({
			name: 'Rota 1',
			date: DateTime.fromISO('2024-12-16T12:00:00.000'),
			totalDistanceKm: 40,
			totalTimeMs: 14400000,
			status: RouteStatus.enum.IN_PROGRESS,
			collections: [
				{
					id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
					status: 'FINISHED',
					date: DateTime.now(),
					volumeCollected: 0,
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					collectionPoint: collectionPointMock1.serialize(),
				},

				{
					id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
					status: 'FINISHED',
					date: DateTime.now(),
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					volumeCollected: 0,
					collectionPoint: collectionPointMock2.serialize(),
				},
			],
		});
		route.finish();
		expect(route.finishedAt?.toJSDate()).toEqual(now);
	});
});
