import type { NextFunction, Request, Response } from 'express';
import { ForbiddenProblem } from '../../../infra/errors/generic-problem';
import { noopMiddleware } from './noop';
import env from 'env-var';

const WILL_DISABLE_AUTHENTICATION = env.get('WILL_DISABLE_AUTHENTICATION').default('false').asBool();

/**
 * @param roles A list of roles to test for
 * @example
 *    router.get('/my-resource', requireRoles(['dev']), myResourceController);
 * @returns A middleware with the provided roles
 */
export function requireRoles(roles: string[]) {
	if (WILL_DISABLE_AUTHENTICATION) return noopMiddleware;
	return function authorizationScopesMiddleware(request: Request, _response: Response, next: NextFunction) {
		const { session, logger } = request.context;

		if (!session) {
			logger.debug('no logged user found');
			return next(new ForbiddenProblem());
		}

		for (const role of roles) {
			if (!session.roles.includes(role)) {
				logger.debug('attempt to do operation without roles', {
					expectedRoles: roles,
					actualRoles: session.roles,
				});
				return next(new ForbiddenProblem());
			}
		}
		next();
	};
}
