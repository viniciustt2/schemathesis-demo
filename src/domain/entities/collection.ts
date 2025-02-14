import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DateTime } from 'luxon';
import { CollectionStatus } from '../value-objects/collection-status';
import { CollectionPoint } from './collection-point';

extendZodWithOpenApi(z);
export type CollectionType = z.infer<typeof Collection.schema>;
export class Collection {
	readonly id: string;
	readonly collectionPoint: CollectionPoint;
	readonly routeId: string;
	#status: CollectionStatus;
	readonly notes?: string;
	readonly volumeCollected: number;
	readonly date: DateTime;
	startTime: DateTime | undefined;
	endTime: DateTime | undefined;

	get status() {
		return this.#status;
	}

	static readonly schema = z
		.object({
			id: z.string().uuid().openapi('CollectionId', {
				description: 'UUID da coleta',
				example: '5a17c4b6-845b-419b-8f96-be1f01fa89ab',
			}),
			collectionPoint: CollectionPoint.schema.openapi('CollectionPoint', {
				description: 'Ponto de coleta associado',
			}),
			routeId: z.string().uuid().openapi('RouteId', {
				description: 'UUID da rota associada',
				example: 'f7f16595-8537-486b-9027-ee419435980c',
			}),
			status: CollectionStatus.schema.describe('Status da coleta'),
			notes: z.string().optional().describe('Observações adicionais (opcional)'),
			volumeCollected: z.number().default(0).describe('Volume coletado em litros'),
			date: z
				.string()
				.datetime()
				.transform(string => DateTime.fromISO(string))
				.describe('data e hora que a coleta foi iniciada'),
			startTime: z
				.string()
				.datetime()
				.transform(string => DateTime.fromISO(string))
				.optional()
				.describe('data e hora que a coleta foi iniciada'),
			endTime: z
				.string()
				.datetime()
				.transform(string => DateTime.fromISO(string))
				.optional()
				.describe('data e hora que a coleta foi finalizada'),
		})
		.openapi('Collection', { description: 'Uma coleta realizada em um ponto de coleta' });

	private constructor(collection: CollectionType) {
		this.id = collection.id;
		this.collectionPoint = CollectionPoint.create(collection.collectionPoint);
		this.routeId = collection.routeId;
		this.#status = CollectionStatus.create(collection.status);
		this.notes = collection.notes;
		this.volumeCollected = collection.volumeCollected;
		this.date = collection.date;
		this.startTime = collection.startTime;
		this.endTime = collection.endTime;
	}

	static create(collection: Optional<CollectionType, 'id'>): Collection {
		return new Collection({
			id: collection.id ?? crypto.randomUUID(),
			collectionPoint: collection.collectionPoint,
			routeId: collection.routeId,
			status: collection.status ?? 'PENDING',
			notes: collection.notes,
			volumeCollected: collection.volumeCollected ?? 0,
			date: collection.date,
			startTime: collection.startTime ?? undefined,
			endTime: collection.endTime ?? undefined,
		});
	}

	static fromUnknown(unknown: unknown): Collection {
		const data = Collection.schema.parse(unknown);
		return new Collection(data);
	}

	start() {
		this.startTime = DateTime.now();
		this.#status = CollectionStatus.inProgress();
	}

	finish() {
		this.endTime = DateTime.now();
		this.#status = CollectionStatus.finished();
	}

	isInProgress() {
		return this.status.value === 'IN_PROGRESS';
	}

	isFinished(): boolean {
		return this.status.value === 'FINISHED';
	}

	serialize(): CollectionType {
		return {
			id: this.id,
			routeId: this.routeId,
			status: this.#status.serialize(),
			date: this.date,
			startTime: this.startTime,
			endTime: this.endTime,
			volumeCollected: this.volumeCollected,
			notes: this.notes,
			collectionPoint: this.collectionPoint.serialize(),
		};
	}
}
