import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeAPIResponseFromProblem } from '../openapi/responses';
import { BusinessRuleError, BusinessRuleViolationProblem } from '../../../infra/errors/business-rule-violation';
import { z } from 'zod';
import { SECTION_TAGS } from '../openapi/section-tags';

export const rootRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.WELCOME],
	path: '/',
	summary: 'Boas Vindas',
	description: 'Mensagem de boas vindas da raiz da API',
	responses: {
		'200': { description: 'Uma resposta de boas vindas', content: { 'text/html': { schema: z.string() } } },
		...GENERIC_OPENAPI_RESPONSES,
		...makeAPIResponseFromProblem(
			new BusinessRuleViolationProblem([
				new BusinessRuleError('Não é possível finalizar uma rota com pontos em aberto', '#/route_id'),
			]),
		),
	},
};

export function rootController(_request: Request, response: Response) {
	response.status(200).send('Bem vindos à API Petrópolis');
}
