import type { DetailedError } from './problem-details';
import { Problem } from './generic-problem';

export class ValidationError extends Error implements DetailedError {
	readonly detail: string;
	readonly pointer: string;

	constructor(detail: string, pointer: string) {
		super(detail);
		this.name = 'ValidationError';
		this.pointer = pointer;
		this.detail = detail;
	}

	getDetails() {
		return { detail: this.detail, pointer: this.pointer };
	}
}

export class ValidationErrorProblem extends Problem {
	constructor(errors: ValidationError[]) {
		super({
			type: 'docs/#/problems?id=validation-error',
			title: 'Validation Error',
			detail: 'The request is not valid',
			status: 422,
			code: '422-2',
			errors: errors,
		});
	}

	static error(detail: string, pointer: string) {
		const errors = [new ValidationError(detail, pointer)];
		return new ValidationErrorProblem(errors);
	}
}
