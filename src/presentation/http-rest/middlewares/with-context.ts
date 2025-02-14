import type { NextFunction, Request, Response } from 'express';
import type winston from 'winston';
import type { FileUploadProvider } from '../../../infra/providers/file-upload';

export interface BaseContextConfig {
	/**
	 * A winston logger
	 */
	logger: winston.Logger;
	/**
	 * Provides upload capabilities
	 */
	fileUploadProvider: FileUploadProvider;
}

/**
 * Creates the base context for the application
 * @param config The base config for the application context
 */
export function withContext(config: BaseContextConfig) {
	return function middlware(request: Request, _response: Response, next: NextFunction) {
		request.context = { logger: config.logger, fileUploadProvider: config.fileUploadProvider };
		next();
	};
}
