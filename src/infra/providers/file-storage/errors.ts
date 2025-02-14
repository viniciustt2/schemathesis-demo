export class FileNotFoundError extends Error {
	path: string;

	constructor(message: string, path: string) {
		super(message);
		this.name = 'FileNotFoundError';
		this.path = path;
	}
}
