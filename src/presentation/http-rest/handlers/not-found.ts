import type { Request, Response } from 'express';
import { NotFoundProblem } from '../../../infra/errors/generic-problem';

export function notFoundController(request: Request, response: Response) {
	request.context.logger.error('resource not found', { url: request.url });
	const problem = new NotFoundProblem();
	response.status(problem.status).send(problem);
}
