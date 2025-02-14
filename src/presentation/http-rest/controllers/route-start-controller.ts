import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeAPIResponseFromProblem, makeOpenAPIResponse } from '../openapi/responses';
import { Route } from '../../../domain/entities/route';
import { RouteService } from '../../../application/route';
import { z } from 'zod';
import { SECTION_TAGS } from '../openapi/section-tags';
import { BusinessRuleViolationProblem } from '../../../infra/errors/business-rule-violation';

const params = z.object({ routeId: Route.schema.shape.id });
export const routeStartRouteConfig: RouteConfig = {
	method: 'post',
	tags: [SECTION_TAGS.ROUTES],
	path: '/routes/{routeId}/start',
	summary: 'Inicia uma rota pelo usuário atualmente logado',
	description: 'Retorna a rota depois de iniciada',
	request: { params },
	responses: {
		...makeOpenAPIResponse(200, 'A rota que foi iniciada', Route.schema),
		...makeAPIResponseFromProblem(new BusinessRuleViolationProblem([])),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function routeStartController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { routesRepository, usersRepository } = request.context.repositories;
	const { routeId } = params.parse(request.params);
	const service = new RouteService(routesRepository, usersRepository);
	const result = await service.start(routeId);
	response.status(200).json(result);
}
