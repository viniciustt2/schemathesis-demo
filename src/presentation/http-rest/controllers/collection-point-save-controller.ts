import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { CollectionPoint } from '../../../domain/entities/collection-point';
import { SECTION_TAGS } from '../openapi/section-tags';
import { CollectionPointService } from '../../../application/collection-point';

const body = CollectionPoint.schema.omit({ id: true });

export const collectionPointSaveRouteConfig: RouteConfig = {
	method: 'post',
	tags: [SECTION_TAGS.COLLECTION_POINTS],
	path: '/collection-points/',
	summary: 'Cria um ponto de coleta',
	description: 'Retorna o ponto de coleta criado',
	request: {
		body: {
			content: {
				'application/json': {
					schema: body,
				},
			},
		},
	},
	responses: {
		...makeOpenAPIResponse(200, 'O ponto de coleta criado', CollectionPoint.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function collectionPointCreateController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { collectionPointsRepository, routesRepository, keyCloakRepository, operatorRepository } =
		request.context.repositories;
	const collectionPoint = body.parse(request.body);
	const accessToken = request.context.accessToken;
	if (!accessToken) throw new Error('Nenhum token');
	const service = new CollectionPointService(
		collectionPointsRepository,
		routesRepository,
		keyCloakRepository,
		operatorRepository,
	);
	const result = await service.save(collectionPoint, accessToken);
	response.status(200).json(result);
}
