import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { Route } from '../../../domain/entities/route';
import { RouteService } from '../../../application/route';
import { z } from 'zod';
import { NotFoundProblem } from '../../../infra/errors/generic-problem';
import { SECTION_TAGS } from '../openapi/section-tags';
import { Comment } from '../../../domain/value-objects/comment';
import { Reason } from '../../../domain/value-objects/reason';

const params = z.object({ routeId: Route.schema.shape.id });
const body = z.object({
	reason: Reason.schema,
	comment: Comment.schema,
});

export const routeFinishRouteConfig: RouteConfig = {
	method: 'post',
	tags: [SECTION_TAGS.ROUTES],
	path: '/routes/{routeId}/finish',
	summary: 'Finaliza uma rota pelo usuário atualmente logado',
	description: 'Retorna a rota depois de finalizada',
	request: {
		params,
		body: {
			content: {
				'application/json': {
					schema: body,
				},
			},
		},
	},
	responses: {
		...makeOpenAPIResponse(200, 'A rota que foi finalizada', Route.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function routeFinishtController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { routesRepository, usersRepository } = request.context.repositories;
	const { routeId } = params.parse(request.params);
	const service = new RouteService(routesRepository, usersRepository);
	const { reason, comment } = body.parse(request.body);

	const result = await service.finish(routeId, reason, comment);

	if (result === null) throw new NotFoundProblem();
	response.status(200).json(result);
}
