import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { Route } from '../../../domain/entities/route';
import { RouteService } from '../../../application/route';
import { z } from 'zod';
import { NotFoundProblem } from '../../../infra/errors/generic-problem';
import { SECTION_TAGS } from '../openapi/section-tags';

const params = z.object({ routeId: Route.schema.shape.id });
export const routeGetByIdRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.ROUTES],
	path: '/routes/{routeId}',
	summary: 'Obter rota pelo seu id',
	description: 'Retorna a rota com o id especificado',
	request: { params },
	responses: {
		...makeOpenAPIResponse(200, 'Uma rota de coleta de vidro', Route.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function routeGetByIdController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { routesRepository, usersRepository } = request.context.repositories;
	const { routeId } = params.parse(request.params);

	const service = new RouteService(routesRepository, usersRepository);
	const result = await service.getById(routeId);
	if (result === null) throw new NotFoundProblem();
	response.status(200).json(result);
}
