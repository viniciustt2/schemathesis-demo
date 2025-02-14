import type { User } from '../entities/user';

export interface UsersRepository {
	me(): Promise<User>;
}
