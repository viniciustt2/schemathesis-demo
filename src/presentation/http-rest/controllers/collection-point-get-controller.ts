import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { CollectionPoint } from '../../../domain/entities/collection-point';
import { CollectionPointService } from '../../../application/collection-point';
import { z } from 'zod';
import { SECTION_TAGS } from '../openapi/section-tags';

const params = z.object({ collectionPointId: CollectionPoint.schema.shape.id });
export const collectionPointGetByIdRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.COLLECTION_POINTS],
	path: '/collection-points/{collectionPointId}',
	summary: 'Obter ponto de coleta por id',
	description: 'Retorna o ponto de coleta com o id especificado',
	request: { params },
	responses: {
		...makeOpenAPIResponse(200, 'Um ponto de coleta no contexto de uma rota', CollectionPoint.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function collectionPointGetByIdController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { collectionPointsRepository, routesRepository, keyCloakRepository, operatorRepository } =
		request.context.repositories;
	const { collectionPointId } = params.parse(request.params);

	const service = new CollectionPointService(
		collectionPointsRepository,
		routesRepository,
		keyCloakRepository,
		operatorRepository,
	);
	const result = await service.getById(collectionPointId);
	response.status(200).json(result);
}
