/* eslint-disable sonarjs/no-duplicate-string */
import request from 'supertest';
import app from '../../src/app';

describe('Testing endpoints for collections', { sequential: true }, () => {
	it('should get a single collection', async () => {
		expect.assertions(1);
		const response = await request(app)
			.get('/api/v1/collections/a323eadb-1ffc-4227-b4c4-0b9ee48d38a2')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/);
		expect(response.status).toBe(200);
	});
});
