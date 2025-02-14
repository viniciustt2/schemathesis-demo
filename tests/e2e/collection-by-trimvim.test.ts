import app from '../../src/app';
import request from 'supertest';
import { CollectionPointStatus } from '../../src/domain/value-objects/collection-point-status';
import { RouteStatus } from '../../src/domain/value-objects/route-status';
import { CollectionStatus } from '../../src/domain/value-objects/collection-status';

interface SerializedCollection {
	id: string;
	collectionPointId: string;
	routeId: string;
	status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED';
	notes?: string;
	volumeCollected: number;
	date: string;
	startTime?: string;
	endTime?: string;
}

describe.sequential('[PET-146] Driver collects using  a TRIVIM', () => {
	it('should receive the logged in user', async () => {
		expect.assertions(2);
		const response = await request(app)
			.get('/api/v1/me')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9',
			fullName: 'Motorista',
			initials: 'MO',
		});
	});

	it('should receive a list with a single vehicle', async () => {
		expect.assertions(2);
		const response = await request(app)
			.get('/api/v1/vehicles')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
		expect(response.body).toEqual([
			{
				id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e',
				name: 'TRIVIM 1',
			},
		]);
	});
	it('should get the specified route', async () => {
		expect.assertions(2);
		const response = await request(app)
			.get('/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			id: 'f7f16595-8537-486b-9027-ee419435980c',
			name: 'Rota 1',
			date: '2024-12-16T12:00:00.000Z',
			collections: [
				{
					id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
					status: CollectionStatus.enum.PENDING,
					date: '2024-12-16T12:00:00.000+00:00',
					volumeCollected: 0,
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					collectionPoint: {
						type: 'APARTMENT',
						id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
						name: 'Edifício Itamarati',
						status: CollectionPointStatus.enum.ACTIVE,
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
							phone: '1234567890',
							email: 'H9k5y@example.com',
						},
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
					},
				},

				{
					id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
					status: CollectionStatus.enum.PENDING,
					date: '2024-12-16T12:00:00.000+00:00',
					routeId: 'f7f16595-8537-486b-9027-ee419435980c',
					volumeCollected: 0,
					collectionPoint: {
						id: '361754a6-845b-419b-8f96-be1f01fa899e',
						name: 'Edifício Residencial Lausanne',
						status: CollectionPointStatus.enum.ACTIVE,
						address: {
							city: 'Sao Paulo',
							street: 'Rua Lorem Ipsum',
							complement: 'Entrada Sul',
							district: 'Vila Mariana',
							number: '123',
							state: 'SP',
							zipcode: '04026-000',
							coordinate: { latitude: -8.038912, longitude: -34.870932 },
						},
						bestCollectionDay: ['FRIDAY'],
						selectiveCollectionDay: ['FRIDAY'],
						contact: {
							name: 'Matias Castro',
							phone: '1234567890',
							email: 'H9k5y@example.com',
						},
						type: 'APARTMENT',
						weeklyGlassVolume: 1000,
						operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
					},
				},
			],
			totalDistanceKm: 40,
			totalTimeMs: 1000 * 60 * 60 * 4,
			status: RouteStatus.enum.PENDING,
		});
	});

	let collectionId = '';
	let collectionId2 = '';
	it('should start the route', async () => {
		expect.assertions(4);
		const response = await request(app)
			.post('/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c/start')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);

		collectionId = response.body.collections[0].id;
		collectionId2 = response.body.collections[1].id;
		expect(response.status).toBe(200);
		expect(response.body.status).toBe(RouteStatus.enum.IN_PROGRESS);
		expect(Array.isArray(response.body.collections)).toBe(true);
		if (response.body.collections.length > 0) {
			expect(
				response.body.collections.every((collection: SerializedCollection) => collection.status === 'PENDING'),
			).toBe(true);
		}
	});

	it('should receive the collection point of specified id', async () => {
		expect.assertions(2);
		const response = await request(app)
			.get('/api/v1/collection-points/361754a6-845b-419b-8f96-be1f01fa899e')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			id: '361754a6-845b-419b-8f96-be1f01fa899e',
			name: 'Edifício Residencial Lausanne',
			status: CollectionPointStatus.enum.ACTIVE,
			operatorId: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
			address: {
				city: 'Sao Paulo',
				street: 'Rua Lorem Ipsum',
				district: 'Vila Mariana',
				number: '123',
				state: 'SP',
				zipcode: '04026-000',
				complement: 'Entrada Sul',

				coordinate: { latitude: -8.038912, longitude: -34.870932 },
			},
			bestCollectionDay: ['FRIDAY'],
			selectiveCollectionDay: ['FRIDAY'],
			contact: {
				name: 'Matias Castro',
				phone: '1234567890',
				email: 'H9k5y@example.com',
			},
			type: 'APARTMENT',
			weeklyGlassVolume: 1000,
		});
	});
	it('should start the first collection', async () => {
		expect.assertions(2);
		const response = await request(app)
			.post(`/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c/collections/${collectionId}/start`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);

		expect(response.status).toBe(200);
		expect(response.body.status).toEqual(CollectionStatus.enum.IN_PROGRESS);
	});
	it('should finish the first collection point', async () => {
		expect.assertions(2);
		const response = await request(app)
			.post(`/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c/collections/${collectionId}/finish`)
			.send({ reason: 'FINISHED', comment: 'Rota finalizada' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
		expect(response.body.status).toEqual(CollectionStatus.enum.FINISHED);
	});
	it('should start the second collection point', async () => {
		expect.assertions(2);
		const response = await request(app)
			.post(`/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c/collections/${collectionId2}/start`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
		expect(response.body.status).toEqual(CollectionStatus.enum.IN_PROGRESS);
	});
	it('should finish the second collection point', async () => {
		expect.assertions(2);
		const response = await request(app)
			.post(`/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c/collections/${collectionId2}/finish`)
			.send({ reason: 'FINISHED', comment: 'Rota finalizada' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);

		expect(response.status).toBe(200);
		expect(response.body.status).toEqual(CollectionStatus.enum.FINISHED);
	});
	it('should finish the route', async () => {
		expect.assertions(2);
		const response = await request(app)
			.post('/api/v1/routes/f7f16595-8537-486b-9027-ee419435980c/finish')
			.send({ reason: 'FINISHED', comment: 'Rota finalizada' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
		expect(response.body.status).toEqual(RouteStatus.enum.FINISHED);
	});
});
