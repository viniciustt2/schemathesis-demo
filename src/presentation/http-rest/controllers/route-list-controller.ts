import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { Route } from '../../../domain/entities/route';
import { RouteService } from '../../../application/route';
import { SECTION_TAGS } from '../openapi/section-tags';

export const routeListRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.ROUTES],
	path: '/routes',
	summary: 'Listar rotas pendentes',
	description: 'Retorna uma lista de rotas para o motorista do TRIVIM',
	responses: {
		...makeOpenAPIResponse(200, 'Uma lista de rotas', Route.schema.array()),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function routeListController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { routesRepository, usersRepository } = request.context.repositories;
	const service = new RouteService(routesRepository, usersRepository);
	const result = await service.list();
	response.status(200).json(result);
}
