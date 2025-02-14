import type { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type { ProblemDetails } from '../../../infra/errors/problem-details';
import {
	BadRequestProblem,
	ForbiddenProblem,
	InvalidParametersProblem,
	NotFoundProblem,
	ServerErrorProblem,
	UnauthorizedProblem,
} from '../../../infra/errors/generic-problem';
import { ValidationErrorProblem } from '../../../infra/errors/validation-error';

type OpenAPIResponse = { [key in number]: ResponseConfig };

const PROBLEM_DETAILS_RESPONSE_SCHEMA = Object.freeze(
	z.object({
		type: z.string(),
		title: z.string(),
		detail: z.string(),
		status: z.number(),
		code: z.string(),
		errors: z
			.object({
				detail: z.string(),
				pointer: z.string().optional(),
				parameter: z.string().optional(),
			})
			.array()
			.optional(),
	}),
);

export const GENERIC_OPENAPI_RESPONSES = Object.freeze({
	...makeAPIResponseFromProblem(new NotFoundProblem()),
	...makeAPIResponseFromProblem(new UnauthorizedProblem()),
	...makeAPIResponseFromProblem(new ForbiddenProblem()),
	...makeAPIResponseFromProblem(new BadRequestProblem()),
	...makeAPIResponseFromProblem(new InvalidParametersProblem()),
	...makeAPIResponseFromProblem(new ServerErrorProblem()),
	...makeAPIResponseFromProblem(new ValidationErrorProblem([])),
});

export function makeOpenAPIResponse(status: number, description: string, schema?: z.ZodType<unknown>): OpenAPIResponse {
	if (schema) return { [status]: { content: { 'application/json': { schema } }, description } };
	return { [status]: { description } };
}

/**
 * Converts a ProblemDetails object in an http response for the lib zod-to-openapi
 * @param problem An object that implements ProblemDetails
 * @returns The http code and the schema for the response
 */
export function makeAPIResponseFromProblem(problem: ProblemDetails): OpenAPIResponse {
	return {
		[problem.status]: {
			content: { 'application/json': { schema: PROBLEM_DETAILS_RESPONSE_SCHEMA } },
			description: `Erro do tipo ${problem.title}: ${problem.detail}. Veja ${problem.type}`,
		},
	};
}
