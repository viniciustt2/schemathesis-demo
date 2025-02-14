import type { PrismaClient, Operator as PrismaOperator } from '@prisma/client';
import { Operator } from '../../domain/entities/operator';
import type { OperatorRepository } from '../../domain/repositories/operator-repository';

export const OperatorPrismaMapper = {
	/**
	 * Maps the domain entity into the prisma model
	 * @param entity A domain entity
	 * @returns A prisma create or update model
	 */
	fromEntity(entity: Operator): Omit<PrismaOperator, 'createdAt' | 'updatedAt'> {
		return {
			id: entity.id,
			name: entity.name,
			cep: entity.cep,
			cnpj: entity.cnpj,
			contact: entity.contact,
			phone: entity.phone,
			email: entity.email,
			status: entity.status, // Enum: 'ACTIVE' | 'INACTIVE'
			cnpjFile: entity.documents.cnpjFile ?? null,
			municipalRegistrationFile: entity.documents.municipalRegistrationFile ?? null,
			environmentalLicenseFile: entity.documents.environmentalLicenseFile ?? null,
			operationLicenseFile: entity.documents.operationLicenseFile ?? null,
		};
	},

	/**
	 * Maps the prisma model into the domain entity
	 * @param model A model returned from prisma. It must be fully hydrated
	 * with all sub models.
	 * @returns The corresponding entity
	 */
	toEntity(model: PrismaOperator): Operator {
		return Operator.create({
			id: model.id,
			name: model.name,
			cep: model.cep,
			cnpj: model.cnpj,
			contact: model.contact,
			phone: model.phone,
			email: model.email,
			documents: {
				cnpjFile: model.cnpjFile ?? undefined,
				municipalRegistrationFile: model.municipalRegistrationFile ?? undefined,
				environmentalLicenseFile: model.environmentalLicenseFile ?? undefined,
				operationLicenseFile: model.operationLicenseFile ?? undefined,
			},
			status: model.status as 'ACTIVE' | 'INACTIVE',
		});
	},

	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be
	 * fully hydrated with all sub models.
	 * @returns The converted list of entities
	 */
	toManyEntities(models: PrismaOperator[]): Operator[] {
		return models.map(model => this.toEntity(model));
	},
};
export class OperatorPrismaRepository implements OperatorRepository {
	constructor(private readonly prisma: PrismaClient) {}
	async getById(id: string): Promise<Operator | null> {
		const operator = await this.prisma.operator.findUnique({ where: { id } });
		if (!operator) return null;
		return OperatorPrismaMapper.toEntity(operator);
	}
}
