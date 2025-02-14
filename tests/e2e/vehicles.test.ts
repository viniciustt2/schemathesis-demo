/* eslint-disable sonarjs/no-duplicate-string */
import request from 'supertest';
import app from '../../src/app';

describe('Testing endpoints for vehicles', { sequential: true }, () => {
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
});
