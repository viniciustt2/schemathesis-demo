import type { CollectionPoint } from '../../domain/entities/collection-point';
import type { KeycloakRepository } from '../../domain/repositories/keycloak-repository';
import type { KeycloakUser } from '../providers/keycloak';

export class KeyCloakMockRepository implements KeycloakRepository {
	async delete(_userId: string, _accessToken: string): Promise<void> {
		return;
	}
	async save(_collectionPoint: CollectionPoint, _accessToken: string): Promise<void> {
		return;
	}
	async me(_userAccessToken: string): Promise<KeycloakUser> {
		return {
			id: 'mock-user-id',
			username: 'mock-username',
			email: 'mock.user@example.com',
			enabled: true,
			attributes: {},
		};
	}
}
