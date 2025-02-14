import type { RoutesRepository } from '../domain/repositories/routes-repository';
import type { UsersRepository } from '../domain/repositories/users-repository';
import { Comment } from '../domain/value-objects/comment';
import { Reason } from '../domain/value-objects/reason';
import { UserRoutesRules } from '../domain/services/user-service';
import { ResourceNotFoundProblem } from '../infra/errors/resource-not-found';

export class RouteService {
	constructor(
		private routesRepository: RoutesRepository,
		private usersRepository: UsersRepository,
	) {}

	async list() {
		const routes = await this.routesRepository.list();
		return routes.map(route => route.serialize());
	}

	async getById(routeId: string) {
		const route = await this.routesRepository.getById(routeId);
		if (!route) return null;
		return route.serialize();
	}

	async start(routeId: string) {
		const me = await this.usersRepository.me();
		const route = await this.routesRepository.getById(routeId);
		if (!route) return null;
		await new UserRoutesRules(this.routesRepository).ensureHasSingleRouteInProgress(me.id);
		route.start(me);
		await this.routesRepository.save(route);
		return route.serialize();
	}

	async finish(routeId: string, reason?: string, comment?: string) {
		const route = await this.routesRepository.getById(routeId);
		if (!route) return null;

		const fromUnknownReason = Reason.fromUnknown(reason);
		const fromUnknownComment = Comment.fromUnknown(comment);

		route.finish(fromUnknownReason, fromUnknownComment);

		await this.routesRepository.save(route);
		return route.serialize();
	}

	async startCollection(collectionId: string, routeId: string) {
		const route = await this.routesRepository.getById(routeId);
		if (!route) throw ResourceNotFoundProblem.error('Rota nao encontrada', 'routeId');

		const collection = route.startCollection(collectionId);

		await this.routesRepository.save(route);

		return collection.serialize();
	}

	async finishCollection(collectionPointId: string, routeId: string) {
		const route = await this.routesRepository.getById(routeId);
		if (!route) throw ResourceNotFoundProblem.error('Rota nao encontrada', 'routeId');

		const collection = route.finishCollection(collectionPointId);

		await this.routesRepository.save(route);

		return collection.serialize();
	}
}
