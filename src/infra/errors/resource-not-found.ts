import { Problem } from './generic-problem';
import type { DetailedError } from './problem-details';

export class ResourceNotFoundError extends Error implements DetailedError {
	readonly detail: string;
	readonly pointer: string;

	constructor(detail: string, pointer: string) {
		super(detail);
		this.name = 'ResourceNotFoundError';
		this.pointer = pointer;
		this.detail = detail;
	}

	getDetails() {
		return { detail: this.detail, pointer: this.pointer };
	}
}

/**
 * Use for anytime a resource is not found in the request
 * @example
 * 	const problem = ResourceNotFound.error('User does not exisst', '#/userId');
 *  throw problem;
 */
export class ResourceNotFoundProblem extends Problem {
	constructor(errors: ResourceNotFoundError[]) {
		super({
			type: 'docs/#/problems?id=resource-not-found',
			title: 'Resource Not Found',
			detail: 'The resource does not exist',
			errors: errors,
			status: 404,
			code: '404-2',
		});
	}

	static error(detail: string, pointer: string) {
		const errors = [new ResourceNotFoundError(detail, pointer)];
		return new ResourceNotFoundProblem(errors);
	}
}
