import { User } from '../../domain/entities/user';
import type { UsersRepository } from '../../domain/repositories/users-repository';

export class UsersMockRepository implements UsersRepository {
	async me(): Promise<User> {
		return User.create({
			id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9',
			fullName: 'Motorista',
			initials: 'MO',
		});
	}
}
