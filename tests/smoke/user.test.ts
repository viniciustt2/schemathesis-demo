import { User } from '../../src/domain/entities/user';

describe('[smoke] basic users operations', () => {
	it('should create a user and serialize', () => {
		expect.hasAssertions();
		const user = User.create({
			id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9',
			fullName: 'Motorista',
			initials: 'MO',
		});
		const serialized = user.serialize();
		expect(serialized).toMatchInlineSnapshot(`
			{
			  "fullName": "Motorista",
			  "id": "1f1309e9-498b-4892-9f8f-5c87d0dd83b9",
			  "initials": "MO",
			}
		`);
	});
});
