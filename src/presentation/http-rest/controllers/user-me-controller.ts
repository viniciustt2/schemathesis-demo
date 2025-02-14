import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { User } from '../../../domain/entities/user';
import { UserService } from '../../../application/user';
import { SECTION_TAGS } from '../openapi/section-tags';

export const userMeRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.AUTH],
	path: '/me',
	summary: 'Informações do usuário',
	description: 'Retorna informações do usuário atualmente logado',
	responses: {
		...makeOpenAPIResponse(200, 'Uma lista de rotas pendentes', User.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function userMeController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { usersRepository } = request.context.repositories;
	const service = new UserService(usersRepository);
	const result = await service.me();
	response.status(200).json(result);
}
