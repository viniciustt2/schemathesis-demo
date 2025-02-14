import type { CollectionPoint } from '../../../domain/entities/collection-point';
import type { CollectionPointsRepository } from '../../../domain/repositories/collection-points-repository';
import type { KeyCloak } from './keycloak';
import type { KeycloakUser } from './keycloak-http';

export class KeyCloakFake implements KeyCloak {
	async createCollectionPoint(
		_collectionPoint: CollectionPoint,
		_accessToken: string,
		_collectionPointsRepository: CollectionPointsRepository,
	): Promise<void> {
		return;
	}

	async delete(_userId: string, _accessToken: string): Promise<void> {
		return;
	}

	async me(_accessToken: string): Promise<KeycloakUser> {
		return {
			id: '821e302b-41da-4e96-842f-d33087510e75',
			username: 'MOTORISTA',
			email: 'johndoe@gmail.com',
			enabled: true,
			attributes: {},
		};
	}
}
