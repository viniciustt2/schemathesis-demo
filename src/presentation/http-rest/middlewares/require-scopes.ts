import type { NextFunction, Request, Response } from 'express';
import { ForbiddenProblem } from '../../../infra/errors/generic-problem';
import env from 'env-var';
import { noopMiddleware } from './noop';

const WILL_DISABLE_AUTHENTICATION = env.get('WILL_DISABLE_AUTHENTICATION').default('false').asBool();

/**
 * @param scopes A list of scopes to test for
 * @example
 *    router.get('/my-resource', requireScopes(['read:my-resource']), myResourceController);
 * @returns A middleware with the provided scopes
 */
export function requireScopes(scopes: string[]) {
	if (WILL_DISABLE_AUTHENTICATION) return noopMiddleware;
	return function authorizationScopesMiddleware(request: Request, _response: Response, next: NextFunction) {
		const { session, logger } = request.context;

		if (!session) {
			logger.debug('no logged user found');
			return next(new ForbiddenProblem());
		}

		for (const scope of scopes) {
			if (!session.scopes.includes(scope)) {
				logger.debug('attempt to do operation without scopes', {
					expectedScopes: scopes,
					actualScopes: session.scopes,
				});
				return next(new ForbiddenProblem());
			}
		}
		next();
	};
}
