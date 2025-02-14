/* eslint-disable sonarjs/no-duplicate-string */
import request from 'supertest';
import app from '../../src/app';
describe('Testing endpoints for collection points', { sequential: true }, () => {
	it('should list the collection points', async () => {
		expect.assertions(1);
		const response = await request(app)
			.get('/api/v1/collection-points')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
	});
});
