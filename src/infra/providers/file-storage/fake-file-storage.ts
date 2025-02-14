import type { AsyncFileStorage, FileStorage } from './file-storage';

export class FakeStorage implements AsyncFileStorage, FileStorage {
	constructor(public file: string | Buffer) {}

	load(): string {
		return this.file.toString();
	}

	save(path: string, content: string | Buffer, append?: boolean | undefined): string {
		if (append) this.file += content.toString();
		else this.file = content;
		return path;
	}

	loadAsync(): Promise<string> {
		return Promise.resolve(this.load());
	}

	deleteAsync(path: string): Promise<string> {
		this.file = '';
		return Promise.resolve(path);
	}

	saveAsync(path: string, content: string | Buffer, append?: boolean | undefined): Promise<string> {
		return Promise.resolve(this.save(path, content, append));
	}
}
