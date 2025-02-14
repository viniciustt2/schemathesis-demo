import type { PrismaClient, Users as PrismaUser } from '@prisma/client';
import type { UsersRepository } from '../../domain/repositories/users-repository';
import { User } from '../../domain/entities/user';

export const UsersPrismaMapper = {
	/**
	 * Maps the domain entity into the prisma model
	 * @param entity A domain entity
	 * @returns A prisma create or update model
	 */
	fromEntity(entity: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
		return {
			id: entity.id,
			fullName: entity.fullName,
			initials: entity.initials,
		};
	},
	/**
	 * Maps the prisma model into the domain entity
	 * @param model A model returned from prisma. It must be fully hydrated
	 * with all sub models.
	 * @returns The corresponding entity
	 */
	toEntity(model: PrismaUser): User {
		return User.create({
			id: model.id,
			fullName: model.fullName,
			initials: model.initials,
		});
	},
	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be
	 * fully hydrated with all sub models.
	 * @returns The converted list of entities
	 */
	toManyEntities(models: PrismaUser[]): User[] {
		return models.map(model => this.toEntity(model));
	},
};

export class UsersPrismaRepository implements UsersRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async me(): Promise<User> {
		const me = await this.prisma.users.findFirstOrThrow();
		return UsersPrismaMapper.toEntity(me);
	}
}
