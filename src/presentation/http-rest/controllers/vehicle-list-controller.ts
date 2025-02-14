import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Request, Response } from 'express';
import { GENERIC_OPENAPI_RESPONSES, makeOpenAPIResponse } from '../openapi/responses';
import { Vehicle } from '../../../domain/entities/vehicle';
import { VehicleService } from '../../../application/vehicle';
import { SECTION_TAGS } from '../openapi/section-tags';

export const vehicleListRouteConfig: RouteConfig = {
	method: 'get',
	tags: [SECTION_TAGS.VEHICLES],
	path: '/vehicles',
	summary: 'Listar veículos disponíveis',
	description: 'Retorna uma lista de veículos disponíveis para o motorista do TRIVIM',
	responses: {
		...makeOpenAPIResponse(200, 'Uma lista de veículos disponíveis', Vehicle.schema.array()),
		...GENERIC_OPENAPI_RESPONSES,
	},
};

export async function vehicleListController(request: Request, response: Response) {
	if (!request.context.repositories) throw new Error('Nenhum repositório');
	const { vehiclesRepository } = request.context.repositories;
	const service = new VehicleService(vehiclesRepository);
	const result = await service.list();
	response.status(200).json(result);
}
