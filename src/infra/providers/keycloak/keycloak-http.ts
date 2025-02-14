import type { CollectionPoint } from '../../../domain/entities/collection-point';
import type { CollectionPointsRepository } from '../../../domain/repositories/collection-points-repository';
import { BusinessRuleViolationProblem } from '../../errors/business-rule-violation';
import { BadRequestProblem, ForbiddenProblem } from '../../errors/generic-problem';
import { ResourceNotFoundProblem } from '../../errors/resource-not-found';
import type { KeyCloak } from './keycloak';
import { type Credentials, fetchTokenResponseSchema } from './schemas';
import env from 'env-var';

interface KeycloakLoginOptions {
	domain: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	username: string;
	password: string;
}

export interface KeycloakUser {
	id: string;
	username: string;
	email: string;
	enabled: boolean;
	attributes?: Record<string, string[]>;
}

interface KeycloakRole {
	id: string;
	name: string;
	description: string;
	composite: boolean;
	clientRole: boolean;
	containerId: string;
}

const KEYCLOAK_CLIENT_ID = env.get('KEYCLOAK_CLIENT_ID').required().asString();

export class KeycloakHttp implements KeyCloak {
	private constructor(
		private readonly credentials: Credentials,
		private readonly domain: string,
	) {}

	static async createAuthenticated(options: KeycloakLoginOptions): Promise<KeycloakHttp> {
		const tokenEndpoint = new URL('/realms/petropolis/protocol/openid-connect/token', options.domain);
		const credentials = `${options.client_id}:${options.client_secret}`;
		const encodedCredentials = Buffer.from(credentials).toString('base64');

		const response = await fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${encodedCredentials}`,
			},
			body: new URLSearchParams({
				grant_type: options.grant_type,
				username: options.username,
				password: options.password,
				client_id: options.client_id,
				client_secret: options.client_secret,
			}).toString(),
		});

		const json = await response.json();
		return new KeycloakHttp(fetchTokenResponseSchema.parse(json), options.domain);
	}

	async createCollectionPoint(
		collectionPoint: CollectionPoint,
		userAccessToken: string,
		collectionPointsRepository: CollectionPointsRepository,
	): Promise<void> {
		let userId: string | null = null;
		const headers = this.createHeaders(userAccessToken);
		try {
			const createUserResponse = await fetch(`${this.domain}/admin/realms/petropolis/users`, {
				method: 'POST',
				headers,
				body: JSON.stringify(this.mapCollectionPointToKeycloakUser(collectionPoint.contact.email)),
			});

			if (!createUserResponse.ok) {
				if (createUserResponse.status === 403) {
					throw new ForbiddenProblem();
				}
				const errorBody = await createUserResponse.json();
				console.error('Erro ao criar usuário:', errorBody);
				throw BusinessRuleViolationProblem.error(errorBody.errorMessage, 'email');
			}

			const user = await this.findUserByEmail(collectionPoint.contact.email, headers);
			if (!user) throw ResourceNotFoundProblem.error('Usuário não encontrado após criação.', 'email');
			userId = user.id;
			await this.assignRoleToUser(user.id, 'collection-point', headers);
			await collectionPointsRepository.save(collectionPoint);
		} catch (error) {
			if (userId) {
				await this.deleteUser(userId, headers);
			}
			throw error;
		}
	}

	private mapCollectionPointToKeycloakUser(email: string): Record<string, unknown> {
		return {
			username: email,
			email: email,
			enabled: true,
		};
	}

	private async findUserByEmail(email: string, headers: Headers): Promise<KeycloakUser | null> {
		const response = await fetch(
			`${this.domain}/admin/realms/petropolis/users?email=${encodeURIComponent(email)}&exact=true`,
			{
				method: 'GET',
				headers,
			},
		);

		if (!response.ok) throw ResourceNotFoundProblem.error(`Erro ao buscar usuário: ${response.statusText}`, 'email');

		const users: KeycloakUser[] = await response.json();
		return users.length > 0 && users[0] ? users[0] : null;
	}

	private async assignRoleToUser(userId: string, roleName: string, headers: Headers): Promise<void> {
		const clientId = await this.getClientIdByName(headers, KEYCLOAK_CLIENT_ID);
		const role = await this.getRoleByName(headers, clientId, roleName);

		if (!role) {
			throw ResourceNotFoundProblem.error(`Role '${roleName}' não encontrada para o cliente.`, 'role');
		}

		const roleMappingUrl = `${this.domain}/admin/realms/petropolis/users/${userId}/role-mappings/clients/${clientId}`;
		const response = await fetch(roleMappingUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify([role]),
		});

		if (!response.ok) {
			new BadRequestProblem();
		}
	}

	private async getClientIdByName(headers: Headers, clientName: string): Promise<string> {
		const clientsResponse = await fetch(`${this.domain}/admin/realms/petropolis/clients`, {
			method: 'GET',
			headers,
		});
		if (!clientsResponse.ok) {
			throw ResourceNotFoundProblem.error(`Erro ao buscar clientes: ${clientsResponse.statusText}`, 'clients');
		}

		const clients: { id: string; clientId: string }[] = await clientsResponse.json();
		const client = clients.find(c => c.clientId === clientName);

		if (!client) {
			throw ResourceNotFoundProblem.error(`Cliente '${clientName}' não encontrado.`, 'client');
		}

		return client.id;
	}

	private async getRoleByName(headers: Headers, clientId: string, roleName: string): Promise<KeycloakRole | null> {
		const rolesResponse = await fetch(`${this.domain}/admin/realms/petropolis/clients/${clientId}/roles`, {
			method: 'GET',
			headers,
		});

		if (!rolesResponse.ok) {
			throw ResourceNotFoundProblem.error(`Erro ao buscar roles: ${rolesResponse.statusText}`, 'roles');
		}

		const roles: KeycloakRole[] = await rolesResponse.json();
		return roles.find(role => role.name === roleName) ?? null;
	}

	private async deleteUser(userId: string, headers: Headers): Promise<void> {
		const response = await fetch(`${this.domain}/admin/realms/petropolis/users/${userId}`, {
			method: 'DELETE',
			headers,
		});

		if (!response.ok) {
			console.error(`Falha ao excluir usuário com ID ${userId}:`, response.statusText);
			throw new Error(`Falha ao excluir usuário com ID ${userId}`);
		}
	}

	async delete(userId: string, accessToken: string): Promise<void> {
		const headers = this.createHeaders(accessToken);
		await this.deleteUser(userId, headers);
	}

	async me(accessToken: string): Promise<KeycloakUser> {
		const headers = new Headers({
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		});

		const userinfoEndpoint = `${this.domain}/realms/petropolis/protocol/openid-connect/userinfo`;
		const response = await fetch(userinfoEndpoint, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			const errorBody = await response.json();
			console.error('Erro ao buscar informações do usuário:', errorBody);
			throw new Error(`Erro ao buscar informações do usuário: ${response.statusText}`);
		}

		const userinfo = await response.json();

		return {
			id: userinfo.sub,
			username: userinfo.preferred_username ?? userinfo.name,
			email: userinfo.email,
			enabled: true,
			attributes: userinfo.attributes ?? {},
		};
	}

	private createHeaders(accessToken: string): Headers {
		return new Headers({
			Authorization: `Bearer ${accessToken ?? this.credentials.access_token}`,
			'Content-Type': 'application/json',
		});
	}
}
