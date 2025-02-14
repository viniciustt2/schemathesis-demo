import type { Request, Response, NextFunction } from 'express';

/**
 * Logs the ip and time taken for each request, so that we can profile it later.
 */
export function requestTimeMiddleware(request: Request, response: Response, next: NextFunction) {
	const userIp = request.headers['x-forwarded-for'] ?? request.socket.remoteAddress;
	const logger = request.context.logger;

	const profiler = logger.startTimer();
	response.once('finish', () => profiler.done({ message: request.originalUrl, ip: userIp }));
	next();
}
