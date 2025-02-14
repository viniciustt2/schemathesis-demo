import type { DetailedError } from './problem-details';
import { Problem } from './generic-problem';

export class BusinessRuleError extends Error implements DetailedError {
	readonly detail: string;
	readonly pointer: string;

	constructor(detail: string, pointer: string) {
		super(detail);
		this.name = 'BusinessRuleError';
		this.pointer = pointer;
		this.detail = detail;
	}

	getDetails() {
		return { detail: this.detail, pointer: this.pointer };
	}
}

/**
 * Use for any business rule violation.
 * @example
 * 	const problem = BusinessRuleViolationProblem.error('Scheduling conflict for user', '#/operatorId');
 *  throw problem;
 */
export class BusinessRuleViolationProblem extends Problem {
	constructor(errors: BusinessRuleError[]) {
		super({
			type: 'docs/#/problems?id=business-rule-violation',
			title: 'Business Rule Violation',
			detail: 'The request is invalid and not meeting business rules',
			status: 422,
			code: '422-1',
			errors: errors,
		});
	}

	static error(detail: string, pointer: string) {
		const errors = [new BusinessRuleError(detail, pointer)];
		return new BusinessRuleViolationProblem(errors);
	}
}
