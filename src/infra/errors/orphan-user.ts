import { Problem } from './generic-problem';

export class OrphanUserProblem extends Problem {
	constructor() {
		super({
			type: 'docs/#/problems?id=orphan-user',
			title: 'Orphan User',
			detail: "The user doesn't belong to any organization",
			errors: undefined,
			status: 403,
			code: '403-2',
		});
	}
}
