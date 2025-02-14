import type { NextFunction, Request, Response } from 'express';
import { UsersMockRepository } from '../../../infra/repositories/users-mock-repository';
import { VehiclesMockRepository } from '../../../infra/repositories/vehicles-mock-repository';
import { RoutesMockRepository } from '../../../infra/repositories/routes-mock-repository';
import { CollectionPointsMockRepository } from '../../../infra/repositories/collection-points-mock-repository';
import { KeyCloakMockRepository } from '../../../infra/repositories/keycloak-mock-repository';
import { OperatorMockRepository } from '../../../infra/repositories/operator-mock-repository';
import { CollectionsMockRepository } from '../../../infra/repositories/collections-mock-repositpory';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type RepositoriesContextConfig = {};

/**
 * Creates a context middleware with the provided objects.
 * @param config The configuration to setup the repositories
 * @returns A middleware with the context.
 */
export function withRepositories(_config: RepositoriesContextConfig) {
	return function contextMiddleware(request: Request, _response: Response, next: NextFunction) {
		request.context.repositories = {
			routesRepository: new RoutesMockRepository(),
			usersRepository: new UsersMockRepository(),
			vehiclesRepository: new VehiclesMockRepository(),
			collectionPointsRepository: new CollectionPointsMockRepository(),
			keyCloakRepository: new KeyCloakMockRepository(),
			operatorRepository: new OperatorMockRepository(),
			collectionRepository: new CollectionsMockRepository(),
		};
		next();
	};
}
