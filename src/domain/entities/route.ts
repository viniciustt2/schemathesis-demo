import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { RouteStatus } from '../value-objects/route-status';
import { Collection } from './collection'; // Importando a entidade de coleta
import { User } from './user';
import { Reason } from '../value-objects/reason';
import { Comment } from '../value-objects/comment';
import { ResourceNotFoundProblem } from '../../infra/errors/resource-not-found';
import { BusinessRuleViolationProblem } from '../../infra/errors/business-rule-violation';
extendZodWithOpenApi(z);

export type RouteType = z.infer<typeof Route.schema>;
export type CreateRouteType = Omit<z.infer<typeof Route.schema>, 'collectionsCount'>;

export class Route {
	readonly id: string;
	readonly name: string;
	readonly date: DateTime;
	readonly collections: Collection[];
	readonly totalDistanceKm: number;
	readonly totalTimeMs: number;
	#status: RouteStatus;
	#executor?: User;
	#startedAt?: DateTime | undefined;
	#finishedAt?: DateTime | undefined;
	#reason: Reason | undefined;
	#comment: Comment | undefined;

	// Getters para acessar propriedades privadas
	get status() {
		return this.#status;
	}
	get executor() {
		return this.#executor;
	}
	get startedAt() {
		return this.#startedAt;
	}
	get finishedAt() {
		return this.#finishedAt;
	}
	get reason() {
		return this.#reason;
	}
	get comment() {
		return this.#comment;
	}

	static readonly schema = z
		.object({
			id: z.string().uuid().openapi('RouteId', { example: 'f7f16595-8537-486b-9027-ee419435980c' }),
			name: z.string().describe('nome da rota'),
			date: z
				.string()
				.datetime()
				.transform(string => DateTime.fromISO(string))
				.describe('data que a rota deve ser executada'),
			collections: Collection.schema.array().describe('Coletas da rota'),
			totalDistanceKm: z.number().min(0).describe('distância total da rota em km'),
			totalTimeMs: z.number().int().min(0).describe('tempo total estimado da rota em ms'),
			status: RouteStatus.schema.describe('estado atual da rota de coleta'),
			executor: User.schema.optional().describe('quem iniciou e executou a rota'),
			startedAt: z
				.string()
				.datetime()
				.transform(string => DateTime.fromISO(string))
				.optional()
				.describe('data e hora que a rota foi iniciada'),
			finishedAt: z
				.string()
				.datetime()
				.transform(string => DateTime.fromISO(string))
				.optional()
				.describe('data e hora que a rota foi finalizada'),
			comment: Comment.schema.describe('comentário da rota'),
			reason: Reason.schema.describe('motivo de finalizar a rota'),
		})
		.openapi('Route', { description: 'Uma rota de coleta de resíduo de vidro' });

	private constructor(route: CreateRouteType) {
		this.id = route.id;
		this.name = route.name;
		this.date = route.date;
		this.totalDistanceKm = route.totalDistanceKm;
		this.totalTimeMs = route.totalTimeMs;
		this.collections = route.collections.map(Collection.create);
		this.#status = RouteStatus.create(route.status);
	}

	static create(route: Optional<CreateRouteType, 'id' | 'status' | 'collections'>) {
		return new Route({
			id: route.id ?? crypto.randomUUID(),
			name: route.name,
			date: route.date,
			totalDistanceKm: route.totalDistanceKm,
			totalTimeMs: route.totalTimeMs,
			collections: route.collections ?? [],
			status: route.status ?? RouteStatus.enum.PENDING,
			reason: route.reason,
			comment: route.comment,
		});
	}

	/**
	 * Inicia a rota para ser executada por um usuário que é motorista.
	 * @param executor Quem está iniciando e executará a rota.
	 */
	start(executor: User) {
		if (this.isFinished()) {
			throw BusinessRuleViolationProblem.error('A rota já foi finalizada.', 'status');
		}

		this.#status = RouteStatus.inProgress();
		this.#startedAt = DateTime.now();
		this.#executor = executor;
	}

	/**
	 * Finaliza a rota.
	 */
	finish(reason?: Reason, comment?: Comment) {
		if (this.isFinished()) throw BusinessRuleViolationProblem.error('A rota já foi finalizada.', 'status');
		if (!this.isInProgress())
			throw BusinessRuleViolationProblem.error('A rota precisa estar em andamento para ser finalizada.', 'status');
		const allCollectionsFinished = this.collections.every(collection => collection.isFinished());
		if (!allCollectionsFinished)
			throw BusinessRuleViolationProblem.error(
				'Todas as coletas precisam ser finalizadas para concluir a rota.',
				'status',
			);
		this.#status = RouteStatus.finished();
		this.#finishedAt = DateTime.now();
		this.#reason = reason;
		this.#comment = comment;
	}

	isInProgress() {
		return this.status.value === 'IN_PROGRESS';
	}

	isFinished() {
		return this.status.value === 'FINISHED';
	}

	/**
	 * Inicia uma coleta específica na rota.
	 * @param collectionId ID da coleta a ser iniciada.
	 */
	startCollection(collectionId: string): Collection {
		// Verifica se a rota está em andamento
		if (!this.isInProgress()) {
			throw BusinessRuleViolationProblem.error('A rota precisa estar em andamento para iniciar uma coleta.', 'status');
		}

		// Encontra a coleta associada à rota
		const collection = this.collections.find(collection => collection.id === collectionId);
		if (!collection) {
			throw ResourceNotFoundProblem.error('Coleta não pertence a esta rota.', 'collectionId');
		}

		const hasCollectionInProgress = this.collections.some(collection => collection.isInProgress());
		if (hasCollectionInProgress) {
			throw BusinessRuleViolationProblem.error(
				'Já existe uma coleta em andamento para este ponto de coleta.',
				'status',
			);
		}

		collection.start();
		return collection;
	}

	/**
	 * Finaliza uma coleta específica na rota.
	 * @param collectionId ID da coleta a ser finalizada.
	 */
	/**
	 * Finaliza uma coleta específica na rota.
	 * @param collectionId ID da coleta a ser finalizada.
	 */
	finishCollection(collectionId: string): Collection {
		if (!this.isInProgress()) {
			throw BusinessRuleViolationProblem.error(
				'A rota precisa estar em andamento para finalizar esta coleta.',
				'status',
			);
		}

		const collection = this.collections.find(collection => collection.id === collectionId);
		if (!collection) {
			throw ResourceNotFoundProblem.error('Coleta não pertence a esta rota.', 'collectionId');
		}

		if (collection.isFinished()) {
			throw BusinessRuleViolationProblem.error('A coleta já foi finalizada.', 'status');
		}

		if (!collection.isInProgress()) {
			throw BusinessRuleViolationProblem.error('A coleta precisa estar em andamento para ser finalizada.', 'status');
		}

		collection.finish();

		return collection;
	}

	/**
	 * Retorna uma coleta específica da rota.
	 * @param collectionId ID da coleta.
	 */
	getCollection(collectionId: string): Collection {
		const collection = this.collections.find(col => col.id === collectionId);
		if (!collection) throw ResourceNotFoundProblem.error('Coleta não pertence a esta rota.', 'collectionId');
		return collection;
	}

	static fromUnknown(unknown: unknown): Route {
		const data = Route.schema.parse(unknown);
		return new Route(data);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			date: this.date.toJSDate().toISOString(),
			totalDistanceKm: this.totalDistanceKm,
			totalTimeMs: this.totalTimeMs,
			status: this.status.serialize(),
			collections: this.collections.map(collection => collection.serialize()),
			executor: this.#executor?.serialize(),
			startedAt: this.startedAt?.toJSDate().toISOString(),
			finishedAt: this.finishedAt?.toJSDate().toISOString(),
			comment: this.comment?.serialize(),
			reason: this.reason?.serialize(),
		};
	}
}
