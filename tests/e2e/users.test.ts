/* eslint-disable sonarjs/no-duplicate-string */
import request from 'supertest';
import app from '../../src/app';

describe('Testing endpoints for users', { sequential: true }, () => {
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
});
