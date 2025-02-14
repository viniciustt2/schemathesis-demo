import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { z } from 'zod';
import { SECTION_TAGS } from '../openapi/section-tags';
import { RouteService } from '../../../application/route';
import { Collection } from '../../../domain/entities/collection';

const params = z.object({
	collectionId: Collection.schema.shape.id,
	routeId: Collection.schema.shape.routeId,
});
export const collectionFinishRouteConfig: RouteConfig = {
	method: 'post',
	tags: [SECTION_TAGS.ROUTES],
	path: '/routes/{routeId}/collections/{collectionId}/finish',
	summary: 'Finaliza uma coleta pelo usuário atualmente logado',
	description: 'Retorna uma coleta depois de finalizada',
	request: { params },
	responses: {
		...makeOpenAPIResponse(200, 'A coleta finalizada', Collection.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function collectionFinishController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { routesRepository, usersRepository } = request.context.repositories;
	const { collectionId, routeId } = params.parse(request.params);
	const service = new RouteService(routesRepository, usersRepository);
	const result = await service.finishCollection(collectionId, routeId);
	response.status(200).json(result);
}
