import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import type { ProblemDetails } from '../../../infra/errors/problem-details';
import { ValidationError, ValidationErrorProblem } from '../../../infra/errors/validation-error';
import { Problem, ServerErrorProblem } from '../../../infra/errors/generic-problem';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ResourceNotFoundProblem } from '../../../infra/errors/resource-not-found';
import { extractModelFromMessageP2025 } from '../../../infra/database/prisma-error-extract';

function errorToJSON(error: unknown): Record<string, unknown> {
	return error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
}

function handleZodErrors(error: ZodError): ProblemDetails {
	return new ValidationErrorProblem(
		error.issues.map(issue => {
			const pointer = `#/${issue.path.join('/')}`;
			return new ValidationError(issue.message, pointer);
		}),
	);
}

function handlePrismaErrors(error: PrismaClientKnownRequestError): ProblemDetails {
	if (error.code === 'P2025') {
		const model = extractModelFromMessageP2025(error.message);
		return ResourceNotFoundProblem.error(`The ${model} was not found`, `${model}Id`);
	}

	return new ServerErrorProblem();
}

export function errorHandler(error: unknown, request: Request, response: Response, _next: NextFunction) {
	const logger = request.context.logger;
	let problem: ProblemDetails;

	if (error instanceof ZodError) problem = handleZodErrors(error);
	else if (error instanceof PrismaClientKnownRequestError) problem = handlePrismaErrors(error);
	else if (error instanceof Problem) problem = error;
	else problem = new ServerErrorProblem();

	logger.error(problem.detail, {
		error: errorToJSON(error),
		path: request.path,
		params: request.params,
		body: request.body,
	});
	response.status(problem.status).json(problem);
}
