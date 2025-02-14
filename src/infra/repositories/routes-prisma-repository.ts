import { Route } from '../../domain/entities/route';
import { DateTime } from 'luxon';
import type { RouteStatusEnum } from '../../domain/value-objects/route-status';
import type { PrismaClient, Routes as PrismaRoutes } from '@prisma/client';
import type { RoutesRepository } from '../../domain/repositories/routes-repository';
import type { ReasonEnum } from '../../domain/value-objects/reason';
import type { CommentType } from '../../domain/value-objects/comment';
import { CollectionsPrismaMapper, type CollectionWithRelation } from './collections-prisma-repository';

type RouteWithRelations = PrismaRoutes & {
	collections: CollectionWithRelation[];
};

export const RoutesPrismaMapper = {
	/**
	 * Maps the domain entity into the prisma model
	 * @param entity A domain entity
	 * @returns A prisma create or update model
	 */
	fromEntity(entity: Route): Omit<PrismaRoutes, 'createdAt' | 'updatedAt'> {
		return {
			id: entity.id,
			name: entity.name,
			date: entity.date.toJSDate(),
			status: entity.status.serialize(),
			executorId: entity.executor?.id ?? null,
			startedAt: entity.startedAt?.toJSDate() ?? null,
			finishedAt: entity.finishedAt?.toJSDate() ?? null,
			comment: entity.comment?.serialize() ?? null,
			reasonFinished: entity.reason?.serialize() ?? null,
			totalDistanceKm: entity.totalDistanceKm,
			totalTimeMs: entity.totalTimeMs,
		};
	},
	/**
	 * Maps the prisma model into the domain entity
	 * @param model A model returned from prisma. It must be fully hydrated
	 * with all sub models.
	 * @returns The corresponding entity
	 */
	toEntity(model: RouteWithRelations): Route {
		const collections = CollectionsPrismaMapper.toManyEntities(model.collections);

		return Route.create({
			id: model.id,
			name: model.name,
			status: model.status as RouteStatusEnum,
			date: DateTime.fromJSDate(model.date),
			collections: collections.map(collection => ({
				...collection,
				status: collection.status.serialize(),
				collectionPoint: collection.collectionPoint.serialize(),
			})),
			totalDistanceKm: model.totalDistanceKm,
			totalTimeMs: model.totalTimeMs,
			reason: model.reasonFinished as ReasonEnum,
			comment: model.comment as CommentType,
		});
	},
	/**
	 * Maps the prisma models into the domain entities
	 * @param models A list of models returned from prisma. It must be
	 * fully hydrated with all sub models.
	 * @returns The converted list of entities
	 */
	toManyEntities(models: RouteWithRelations[]): Route[] {
		return models.map(model => this.toEntity(model));
	},
};

export class RoutesPrismaRepository implements RoutesRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async list(): Promise<Route[]> {
		const routes = await this.prisma.routes.findMany({
			include: {
				collections: {
					include: {
						collectionPoint: true,
					},
				},
			},
		});
		return RoutesPrismaMapper.toManyEntities(routes);
	}

	async getById(id: string): Promise<Route | null> {
		const route = await this.prisma.routes.findUnique({
			where: { id },
			include: {
				collections: {
					include: {
						collectionPoint: true,
					},
				},
			},
		});
		if (!route) return null;
		return RoutesPrismaMapper.toEntity(route);
	}

	async save(route: Route): Promise<void> {
		const prismaRouteData = RoutesPrismaMapper.fromEntity(route);
		const collections = CollectionsPrismaMapper.fromManyEntities(route.collections);

		await this.prisma.$transaction([
			this.prisma.routes.upsert({
				where: { id: prismaRouteData.id },
				update: prismaRouteData,
				create: prismaRouteData,
			}),
			...collections.map(collection =>
				this.prisma.collection.upsert({
					where: { id: collection.id },
					update: collection,
					create: collection,
				}),
			),
		]);
		return;
	}

	async hasRoutesInProgressByUser(userId: string): Promise<boolean> {
		const hasRoutesInProgress = await this.prisma.routes.count({
			where: {
				status: 'IN_PROGRESS',
				executorId: userId,
			},
		});

		return hasRoutesInProgress > 0;
	}
}
