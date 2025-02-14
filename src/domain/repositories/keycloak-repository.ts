import type { KeycloakUser } from '../../infra/providers/keycloak';
import type { CollectionPoint } from '../entities/collection-point';

export interface KeycloakRepository {
	save(collectionPoint: CollectionPoint, accessToken: string): Promise<void>;
	delete(userId: string, accessToken: string): Promise<void>;
	me(userAccessToken: string): Promise<KeycloakUser>;
}
