import { Problem } from './generic-problem';

export class AlreadyExistsProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=already-exists',
			title: 'Already Exists',
			detail: 'The resource being created already exists',
			errors: undefined,
			status: 409,
			code: '409-1',
		});
	}
}
