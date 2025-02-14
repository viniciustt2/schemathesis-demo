import type { PrismaClient, CollectionPoints as PrismaCollectionPoint } from '@prisma/client';
import type { CollectionPointsRepository } from '../../domain/repositories/collection-points-repository';
import { CollectionPoint } from '../../domain/entities/collection-point';
import { Address } from '../../domain/value-objects/address';
import { CollectionPointStatus } from '../../domain/value-objects/collection-point-status';
import { Contact } from '../../domain/value-objects/contact';
import type { CollectionPointFiltersType } from '../../domain/value-objects/filters';
import { CollectionPointType } from '../../domain/value-objects/collection-point-type';
import { Responsible } from '../../domain/value-objects/responsible';
import { Shift } from '../../domain/value-objects/shift';
import { Weekday } from '../../domain/value-objects/week-day';

export const CollectionPointsPrismaMapper = {
	/**
	 * Maps the domain entity into the prisma model
	 * @param entity A domain entity
	 * @returns A prisma create or update model
	 */
	fromEntity(entity: CollectionPoint): Omit<PrismaCollectionPoint, 'createdAt' | 'updatedAt'> {
		return {
			id: entity.id,
			name: entity.name,
			address: JSON.stringify(entity.address),
			status: entity.status.serialize(),
			bestCollectionDay: Weekday.toJSON(entity.bestCollectionDay),
			contact: Contact.toJSON(entity.contact),
			selectiveCollectionDay: Weekday.toJSON(entity.selectiveCollectionDay),
			weeklyGlassVolume: entity.weeklyGlassVolume ?? null,
			relevantInfos: entity.relevantInfos ?? null,
			responsible: entity.responsible ? Responsible.toJSON(entity.responsible) : null,
			shifts: Shift.toJSON(entity.shifts),
			type: entity.type.serialize(),
			operatorId: entity.operatorId,
		};
	},
	/**
	 * Maps the domain entities into the prisma models
	 * @param entities A list of domain entities
	 * @returns A list of prisma create or update models
	 */
	fromManyEntities(entities: CollectionPoint[]): Omit<PrismaCollectionPoint, 'createdAt' | 'updatedAt'>[] {
		return entities.map(entity => this.fromEntity(entity));
	},
	/**
	 * Maps the prisma model into the domain entity
	 * @param model A model returned from prisma. It must be fully hydrated
	 * with all sub models.
	 * @returns The corresponding entity
	 */
	toEntity(model: PrismaCollectionPoint): CollectionPoint {
		const contact = Contact.fromJSON(model.contact).serialize();
		const shifts = Shift.fromJSON(model.shifts);
		const bestCollectionDay = Weekday.fromJSON(model.bestCollectionDay);
		const selectiveCollectionDay = Weekday.fromJSONWithUnknown(model.selectiveCollectionDay);
		return CollectionPoint.create({
			id: model.id,
			name: model.name,
			address: Address.fromJSON(model.address),
			status: CollectionPointStatus.schema.parse(model.status),
			bestCollectionDay,
			contact,
			selectiveCollectionDay,
			weeklyGlassVolume: model.weeklyGlassVolume ?? undefined,
			relevantInfos: model.relevantInfos ?? undefined,
			responsible: Responsible.fromJSON(model.responsible),
			shifts,
			type: CollectionPointType.schema.parse(model.type),
			operatorId: model.operatorId,
		});
	},
	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be
	 * fully hydrated with all sub models.
	 * @returns The converted list of entities
	 */
	toManyEntities(models: PrismaCollectionPoint[]): CollectionPoint[] {
		return models.map(model => this.toEntity(model));
	},
};

export class CollectionPointsPrismaRepository implements CollectionPointsRepository {
	constructor(private readonly prisma: PrismaClient) {}
	async list(filters: CollectionPointFiltersType): Promise<CollectionPoint[]> {
		const { limit = 12, offset = 0 } = filters;

		const collectionPoints = await this.prisma.collectionPoints.findMany({
			where: {},
			skip: offset,
			take: limit,
		});

		return CollectionPointsPrismaMapper.toManyEntities(collectionPoints);
	}
	async count(_filters: CollectionPointFiltersType): Promise<number> {
		return this.prisma.collectionPoints.count({
			where: {},
		});
	}

	async getById(id: string): Promise<CollectionPoint> {
		const collectionPoint = await this.prisma.collectionPoints.findUniqueOrThrow({ where: { id } });
		return CollectionPointsPrismaMapper.toEntity(collectionPoint);
	}

	async save(collectionPoint: CollectionPoint): Promise<void> {
		const prismaCollectionPoint = CollectionPointsPrismaMapper.fromEntity(collectionPoint);
		await this.prisma.collectionPoints.upsert({
			where: { id: prismaCollectionPoint.id },
			update: prismaCollectionPoint,
			create: prismaCollectionPoint,
		});
		return;
	}
}
