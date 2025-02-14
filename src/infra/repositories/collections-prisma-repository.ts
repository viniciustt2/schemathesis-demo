import { Collection } from '../../domain/entities/collection';
import type { CollectionsRepository } from '../../domain/repositories/collections.repository';
import type { PrismaClient, Collection as PrismaCollection, CollectionPoints } from '@prisma/client';
import { DateTime } from 'luxon';
import type { CollectionStatusEnum } from '../../domain/value-objects/collection-status';
import { CollectionPointsPrismaMapper } from './collection-points-prisma-repository';

export type CollectionWithRelation = PrismaCollection & { collectionPoint: CollectionPoints };

export const CollectionsPrismaMapper = {
	/**
	 * Maps the domain entity into the prisma model
	 * @param entity A domain entity
	 * @returns A prisma create or update model
	 */
	fromEntity(entity: Collection): Omit<PrismaCollection, 'createdAt' | 'updatedAt'> {
		return {
			id: entity.id,
			collectionPointId: entity.collectionPoint.id,
			routeId: entity.routeId,
			status: entity.status.serialize(),
			date: entity.date.toJSDate(),
			startTime: entity.startTime?.toJSDate() ?? null,
			endTime: entity.endTime?.toJSDate() ?? null,
			volumeCollected: entity.volumeCollected,
			notes: entity.notes ?? null,
		};
	},

	/**
	 * Maps the prisma model into the domain entity
	 * @param model A model returned from prisma. It must be fully hydrated.
	 * @returns The corresponding entity
	 */
	toEntity(model: CollectionWithRelation): Collection {
		const collectionPoint = CollectionPointsPrismaMapper.toEntity(model.collectionPoint);
		return Collection.create({
			id: model.id,
			collectionPoint: {
				...collectionPoint,
				status: collectionPoint.status.serialize(),
				type: collectionPoint.type.serialize(),
				contact: collectionPoint.contact.serialize(),
				shifts: collectionPoint.shifts?.map(shift => shift.serialize()),
				bestCollectionDay: collectionPoint.bestCollectionDay?.map(day => day.serialize()),
				selectiveCollectionDay: collectionPoint.selectiveCollectionDay?.map(day => day.serialize()),
			},
			routeId: model.routeId,
			status: model.status as CollectionStatusEnum,
			volumeCollected: model.volumeCollected,
			date: DateTime.fromJSDate(model.date),
			startTime: model.startTime ? DateTime.fromJSDate(model.startTime) : undefined,
			endTime: model.endTime ? DateTime.fromJSDate(model.endTime) : undefined,
			notes: model.notes ?? undefined,
		});
	},

	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be fully hydrated.
	 * @returns The converted list of entities
	 */
	fromManyEntities(entities: Collection[]): Omit<PrismaCollection, 'createdAt' | 'updatedAt'>[] {
		return entities.map(entity => this.fromEntity(entity));
	},

	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be fully hydrated.
	 * @returns The converted list of entities
	 */
	toManyEntities(models: CollectionWithRelation[]): Collection[] {
		return models.map(model => this.toEntity(model));
	},
};
export class CollectionsPrismaRepository implements CollectionsRepository {
	constructor(private readonly prisma: PrismaClient) {}
	async findById(id: string): Promise<Collection | null> {
		const collection = await this.prisma.collection.findUnique({
			where: { id },
			include: {
				collectionPoint: true,
			},
		});
		if (!collection) return null;
		return CollectionsPrismaMapper.toEntity(collection);
	}
}
