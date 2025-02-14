import { CollectionPoint, type CollectionPointType } from '../domain/entities/collection-point';
import type { CollectionPointsRepository } from '../domain/repositories/collection-points-repository';
import type { RoutesRepository } from '../domain/repositories/routes-repository';
import type { KeycloakRepository } from '../domain/repositories/keycloak-repository';
import type { OperatorRepository } from '../domain/repositories/operator-repository';
import { ResourceNotFoundProblem } from '../infra/errors/resource-not-found';
import type { CollectionPointFiltersType } from '../domain/value-objects/filters';
import { OffsetPaginationPrisma } from '../infra/providers/pagination/offset-pagination-prisma';
import type { Pagination } from '../infra/providers/pagination/pagination';

export class CollectionPointService {
	constructor(
		private collectionPointsRepository: CollectionPointsRepository,
		private routesRepository: RoutesRepository,
		private keycloakRepository: KeycloakRepository,
		private operatorRepository: OperatorRepository,
	) {}

	async getById(collectionPointId: string) {
		const collectionPoint = await this.collectionPointsRepository.getById(collectionPointId);
		if (!collectionPoint) return null;
		return collectionPoint.serialize();
	}

	async listByRouteId(routeId: string) {
		const route = await this.routesRepository.getById(routeId);
		if (!route) return null;
		return route.collections.map(collection => collection.serialize());
	}

	async list(filters: CollectionPointFiltersType): Promise<{ data: CollectionPointType[]; pagination: Pagination }> {
		const collectionPoints = await this.collectionPointsRepository.list(filters);

		const pagination = await OffsetPaginationPrisma.from(filters, this.collectionPointsRepository, 'count');

		return {
			data: collectionPoints.map(collectionPoint => collectionPoint.serialize()),
			pagination: pagination,
		};
	}

	async save(collectionPoint: Optional<CollectionPointType, 'id'>, accessToken: string) {
		const operator = await this.operatorRepository.getById(collectionPoint.operatorId);
		if (!operator) throw ResourceNotFoundProblem.error('Operador nao encontrado', 'operatorId');

		const newCollectionPoint = CollectionPoint.create({
			...collectionPoint,
		});
		await this.keycloakRepository.save(newCollectionPoint, accessToken);
		return newCollectionPoint.serialize();
	}
}
