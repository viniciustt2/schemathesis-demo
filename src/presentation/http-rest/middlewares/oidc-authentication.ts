import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { z } from 'zod';
import { UnauthorizedProblem } from '../../../infra/errors/generic-problem';
import { noopMiddleware } from './noop';

export const TokenPayloadSchema = z.object({
	sub: z.string(),
	scope: z.string(),
	resource_access: z.record(z.string(), z.object({ roles: z.string().array() })),
});

export interface OIDCAuthenticationOptions {
	/**
	 * URL to access the authorization service
	 */
	jwksURL: URL;
	/**
	 * Entity that issues the tokens
	 */
	issuer: string;
	/**
	 * Which resource the user wants to access, in this case, it should be
	 * this API
	 */
	audience: string;
}

/**
 * Returns a middleware to authenticate users
 * @param options OIDC authentication options
 * @param disable If true, it disables authentication
 */
export function withAuthentication(options: OIDCAuthenticationOptions, disable = false) {
	if (disable) return noopMiddleware;
	const jwks = createRemoteJWKSet(options.jwksURL);
	return async function authMiddleware(request: Request, _response: Response, next: NextFunction) {
		if (!request.headers.authorization) return next(new UnauthorizedProblem());
		if (!request.headers.authorization.startsWith('Bearer')) return next(new UnauthorizedProblem());
		try {
			const token = request.headers.authorization.slice(7);
			const { payload } = await jwtVerify(token, jwks, {
				issuer: options.issuer,
				audience: options.audience,
			});

			const { scope, sub: userId, resource_access } = TokenPayloadSchema.parse(payload);
			const roles = Object.values(resource_access).flatMap(resource => resource.roles);
			const scopes = scope.split(' ');
			request.context.session = { userId, scopes, roles };
			request.context.accessToken = token;

			return next();
		} catch (err) {
			request.context.logger.debug('User not authorized', err);
			return next(new UnauthorizedProblem());
		}
	};
}
