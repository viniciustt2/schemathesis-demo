import type { CollectionPoint } from '../../domain/entities/collection-point';
import type { CollectionPointsRepository } from '../../domain/repositories/collection-points-repository';
import type { KeycloakRepository } from '../../domain/repositories/keycloak-repository';
import type { KeyCloak, KeycloakUser } from '../providers/keycloak';

export class KeyCloakRepository implements KeycloakRepository {
	constructor(
		private readonly keycloak: KeyCloak,
		private readonly collectionPointsRepository: CollectionPointsRepository,
	) {}
	async save(collectionPoint: CollectionPoint, accessToken: string): Promise<void> {
		await this.keycloak.createCollectionPoint(collectionPoint, accessToken, this.collectionPointsRepository);
	}
	async me(userAccessToken: string): Promise<KeycloakUser> {
		return await this.keycloak.me(userAccessToken);
	}
	async delete(userId: string, accessToken: string): Promise<void> {
		await this.keycloak.delete(userId, accessToken);
	}
}
