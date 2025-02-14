import type { NextFunction, Request, Response } from 'express';

/**
 * This middleware does nothing. Why it exists? Because then we can "disable" a
 * middleware by returning a noop.
 */
export function noopMiddleware(_request: Request, _response: Response, next: NextFunction) {
	next();
}
