import type { Route } from '../entities/route';

export interface RoutesRepository {
	getById(id: string): Promise<Route | null>;
	list(): Promise<Route[]>;
	hasRoutesInProgressByUser(userId: string): Promise<boolean>;
	save(route: Route): Promise<void>;
}
