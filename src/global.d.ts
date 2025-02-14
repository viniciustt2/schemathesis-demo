import type winston from 'winston';
import type { RoutesRepository } from './domain/repositories/routes-repository';
import type { VehiclesRepository } from './domain/repositories/vehicles-repository';
import type { UsersRepository } from './domain/repositories/users-repository';
import type { CollectionPointsRepository } from './domain/repositories/collection-points-repository';
import type { KeycloakRepository } from './domain/repositories/keycloak-repository';
import type { CollectionsRepository } from './domain/repositories/collections.repository';
import type { FileUploadProvider } from './infra/providers/file-upload';

declare global {
	type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

	type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
	type NonFunctionPropertyNames<T> = {
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		[K in keyof T]: T[K] extends Function ? never : K;
	}[keyof T];

	namespace Express {
		export interface Session {
			/**
			 * Unique identifier of the user (UUID4)
			 */
			userId: string;
			/**
			 * Scope claims of the user, what the user can have access to,
			 * for example read:service-order or write:task
			 */
			scopes: string[];
			/**
			 * Role claims of the user, which roles the user has withing the
			 * resource that is being requested.
			 */
			roles: string[];
		}

		export interface Repositories {
			routesRepository: RoutesRepository;
			vehiclesRepository: VehiclesRepository;
			usersRepository: UsersRepository;
			collectionPointsRepository: CollectionPointsRepository;
			keyCloakRepository: KeycloakRepository;
			operatorRepository: OperatorRepository;
			collectionRepository: CollectionsRepository;
		}

		export interface RequestContext {
			/**
			 * Use this logger instead of console.log or console.error to log
			 * into the console or other sinks.
			 */
			logger: winston.Logger;
			/**
			 * The current session
			 */
			session?: Session;
			/**
			 * List of the repositories to obtain data
			 */
			repositories?: Repositories;
			/**
			 * The access token of the user, if any
			 * */
			accessToken?: string;
			/**
			 * Provides a way to upload a file
			 */
			fileUploadProvider: FileUploadProvider;
		}

		interface Request {
			context: RequestContext;
		}
	}
}
