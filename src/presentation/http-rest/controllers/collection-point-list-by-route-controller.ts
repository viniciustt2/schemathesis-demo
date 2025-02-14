import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { CollectionPoint } from '../../../domain/entities/collection-point';
import { CollectionPointService } from '../../../application/collection-point';
import { z } from 'zod';
import { Route } from '../../../domain/entities/route';
import { SECTION_TAGS } from '../openapi/section-tags';

const params = z.object({ routeId: Route.schema.shape.id });
export const collectionPointListByRouteRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.ROUTES],
	path: '/routes/{routeId}/collection-points',
	summary: 'Listar pontos de coleta de uma rota',
	description: 'Retorna a lista de pontos de coleta de uma rota',
	request: { params },
	responses: {
		...makeOpenAPIResponse(200, 'A lista de pontos de coleta da rota', CollectionPoint.schema.array()),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function collectionPointListByRouteController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { collectionPointsRepository, routesRepository, keyCloakRepository, operatorRepository } =
		request.context.repositories;
	const { routeId } = params.parse(request.params);

	const service = new CollectionPointService(
		collectionPointsRepository,
		routesRepository,
		keyCloakRepository,
		operatorRepository,
	);
	const result = await service.listByRouteId(routeId);
	response.status(200).json(result);
}
