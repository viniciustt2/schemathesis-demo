import type { UsersRepository } from '../domain/repositories/users-repository';

export class UserService {
	constructor(private repository: UsersRepository) {}

	async me() {
		const me = await this.repository.me();
		return me.serialize();
	}
}
