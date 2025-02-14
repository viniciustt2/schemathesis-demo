/* eslint-disable sonarjs/no-duplicate-string */
import request from 'supertest';
import app from '../../src/app';

describe('Simplest test possible', { sequential: true }, () => {
	it('should work', async () => {
		expect.hasAssertions();
		const response = await request(app).get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /text/);
		expect(response.status).toBe(200);
	});
});
