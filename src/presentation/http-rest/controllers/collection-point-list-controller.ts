import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { CollectionPoint } from '../../../domain/entities/collection-point';
import { CollectionPointService } from '../../../application/collection-point';
import { SECTION_TAGS } from '../openapi/section-tags';
import { CollectionPointFiltersSchema } from '../../../domain/value-objects/filters';

export const collectionPointListRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.COLLECTION_POINTS],
	path: '/collection-points',
	summary: 'Listar pontos de coleta',
	description: 'Retorna a lista de pontos de coleta',
	request: { query: CollectionPointFiltersSchema },
	responses: {
		...makeOpenAPIResponse(200, 'A lista de pontos de coleta', CollectionPoint.paginatedSchema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function collectionPointListController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { collectionPointsRepository, routesRepository, keyCloakRepository, operatorRepository } =
		request.context.repositories;
	const filters = CollectionPointFiltersSchema.parse(request.query);

	const service = new CollectionPointService(
		collectionPointsRepository,
		routesRepository,
		keyCloakRepository,
		operatorRepository,
	);
	const result = await service.list(filters);
	response.status(200).json(result);
}
