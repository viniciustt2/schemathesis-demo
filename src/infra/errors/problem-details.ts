export interface DetailedErrorDetails {
	detail: string;
	pointer?: string;
	parameter?: string;
}

export interface DetailedError extends Error {
	/**
	 * Returns the details of the error, it
	 */
	getDetails(): DetailedErrorDetails;
}

export interface ProblemDetails {
	/**
	 * A link to the problem type page
	 */
	readonly type: string;
	/**
	 * The title of the problem, unique for each type
	 */
	readonly title: string;
	/**
	 * The detail of the problem, unique for each type
	 */
	readonly detail: string;
	/**
	 * The http status code for the problem
	 */
	readonly status: number;
	/**
	 * The error code of the problem, unique for each type
	 */
	readonly code: string;
	/**
	 * A list of errors, they must be serializable (toJson)
	 */
	readonly errors: DetailedError[] | undefined;

	/**
	 * Stringifies the problem in a readable way
	 */
	toString(): string;
}
