import type { CollectionPoint } from '../../../domain/entities/collection-point';
import type { CollectionPointsRepository } from '../../../domain/repositories/collection-points-repository';
import type { KeycloakUser } from './keycloak-http';

export interface KeyCloak {
	/**
	 * Create a new user.
	 */
	createCollectionPoint(
		collectionPoint: CollectionPoint,
		accessToken: string,
		collectionPointsRepository: CollectionPointsRepository,
	): Promise<void>;

	/**
	 * Delete a user.
	 */
	delete(userId: string, accessToken: string): Promise<void>;

	/**
	 * Get the current user.
	 */
	me(accessToken: string): Promise<KeycloakUser>;
}
