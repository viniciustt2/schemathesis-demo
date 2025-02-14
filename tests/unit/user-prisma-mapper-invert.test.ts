import { UsersPrismaMapper } from '../../src/infra/repositories/users-prisma-repository';
import { User } from '../../src/domain/entities/user';

type ToEntityInputType = Parameters<typeof UsersPrismaMapper.toEntity>[0];
describe('Invert user prisma mapper', () => {
	beforeEach(() => {
		vi.useFakeTimers({ now: new Date('2025-01-06T10:20:30.000Z') });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be invertible', () => {
		const user = User.create({ id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9', fullName: 'Motorista', initials: 'MO' });
		const inverse = UsersPrismaMapper.fromEntity(user) as ToEntityInputType;
		const reverse = UsersPrismaMapper.toEntity(inverse);
		expect(reverse.serialize()).toEqual(user.serialize());
	});
});
