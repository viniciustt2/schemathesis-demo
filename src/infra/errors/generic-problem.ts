import type { DetailedError, ProblemDetails } from './problem-details';
import env from 'env-var';

const API_BASE_URL = env.get('API_BASE_URL').required().asString();
export class Problem implements ProblemDetails {
	readonly type: string;
	readonly title: string;
	readonly detail: string;
	readonly status: number;
	readonly code: string;
	readonly errors: DetailedError[] | undefined;

	protected constructor(problem: ProblemDetails) {
		this.type = `${API_BASE_URL}${problem.type}`;
		this.title = problem.title;
		this.detail = problem.detail;
		this.status = problem.status;
		this.code = problem.code;
		this.errors = problem.errors;
	}

	toString(): string {
		const object = {
			type: this.type,
			title: this.title,
			detail: this.detail,
			status: this.status,
			code: this.code,
			errors: this.errors?.map(error => error.getDetails()),
		};
		return JSON.stringify(object, undefined, 2);
	}
}

export class NotFoundProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=not-found',
			title: 'Not Found',
			detail: 'The requested resource was not found',
			errors: undefined,
			status: 404,
			code: '404-1',
		});
	}
}

export class UnauthorizedProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=unauthorized',
			title: 'Unauthorized',
			detail: 'Access token not set or invalid, and the request resource could not be returned',
			errors: undefined,
			status: 401,
			code: '401-1',
		});
	}
}

export class ForbiddenProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=forbidden',
			title: 'Forbidden',
			detail: 'The resource could not be returned as the requestor is not authorized',
			errors: undefined,
			status: 403,
			code: '403-1',
		});
	}
}

export class BadRequestProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=bad-request',
			title: 'Bad Request',
			detail: 'The request is invalid or malformed',
			errors: undefined,
			status: 400,
			code: '400-1',
		});
	}
}

export class InvalidParametersProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=invalid-parameters',
			title: 'Invalid Parameters',
			detail: 'The request contained invalid, or malformed parameters (path, header or query)',
			errors: undefined,
			status: 400,
			code: '400-2',
		});
	}
}

export class ServiceUnavailableProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=service-unavailable',
			title: 'Service Unavailable',
			detail: 'The service is currently unavailable',
			errors: undefined,
			status: 503,
			code: '503-1',
		});
	}
}

export class ServerErrorProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=server-error',
			title: 'Server Error',
			detail: 'The server encountered an unexpected error',
			errors: undefined,
			status: 500,
			code: '500-1',
		});
	}
}
