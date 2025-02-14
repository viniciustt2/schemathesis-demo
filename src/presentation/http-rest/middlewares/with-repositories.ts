import type { PrismaClient } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { VehiclesPrismaRepository } from '../../../infra/repositories/vehicles-prisma-repository';
import { CollectionPointsPrismaRepository } from '../../../infra/repositories/collection-points-prisma-repository';
import { RoutesPrismaRepository } from '../../../infra/repositories/routes-prisma-repository';
import { KeyCloakRepository } from '../../../infra/repositories/keycloak-repository';
import type { KeyCloak } from '../../../infra/providers/keycloak';
import { UsersPrismaRepository } from '../../../infra/repositories/users-prisma-repository';
import { OperatorPrismaRepository } from '../../../infra/repositories/operator-prisma-repository';
import { CollectionsPrismaRepository } from '../../../infra/repositories/collections-prisma-repository';

export type RepositoriesContextConfig = {
	/**
	 * A prisma client instance
	 */
	prisma: PrismaClient;
	/**
	 * A keycloak instance
	 */
	keycloak: KeyCloak;
};

/**
 * Creates a context middleware with the provided objects.
 * @param config The configuration to setup the repositories
 * @returns A middleware with the context.
 */
export function withRepositories({ keycloak, prisma }: RepositoriesContextConfig) {
	return function contextMiddleware(request: Request, _response: Response, next: NextFunction) {
		const collectionPointsRepository = new CollectionPointsPrismaRepository(prisma);
		request.context.repositories = {
			routesRepository: new RoutesPrismaRepository(prisma),
			usersRepository: new UsersPrismaRepository(prisma),
			collectionPointsRepository,
			vehiclesRepository: new VehiclesPrismaRepository(prisma),
			keyCloakRepository: new KeyCloakRepository(keycloak, collectionPointsRepository),
			operatorRepository: new OperatorPrismaRepository(prisma),
			collectionRepository: new CollectionsPrismaRepository(prisma),
		};
		next();
	};
}
