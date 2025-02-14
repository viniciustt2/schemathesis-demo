import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { z } from 'zod';
import { SECTION_TAGS } from '../openapi/section-tags';
import { CollectionService } from '../../../application/collection';
import { Collection } from '../../../domain/entities/collection';

const params = z.object({ collectionId: Collection.schema.shape.id });
export const collectionGetByIdRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.COLLECTIONS],
	path: '/collections/{collectionId}',
	summary: 'Obter coleta por id',
	description: 'Retorna a coleta com o id especificado',
	request: { params },
	responses: {
		...makeOpenAPIResponse(200, 'Coleta retornada com sucesso', Collection.schema),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function collectionGetByIdController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { collectionRepository } = request.context.repositories;
	const { collectionId } = params.parse(request.params);
	const service = new CollectionService(collectionRepository);
	const result = await service.getById(collectionId);
	response.status(200).json(result);
}
