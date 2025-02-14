import type { AsyncFileStorage, FileStorage } from './file-storage';
import { readFileSync, writeFileSync } from 'node:fs';
import { writeFile, readFile, unlink } from 'node:fs/promises';
import { FileNotFoundError } from './errors';
import { resolve } from 'node:path';

export class LocalFileStorage implements FileStorage, AsyncFileStorage {
	/**
	 * Creates a new local file storage
	 * @param prefix Prefix to the file path
	 */
	constructor(private prefix = '') {}

	async loadAsync(path: string): Promise<string | Buffer> {
		try {
			const resolvedPath = resolve(this.prefix, path);
			const buffer = await readFile(resolvedPath);
			return buffer.toString();
		} catch (error: unknown) {
			if (error instanceof Error) throw new FileNotFoundError(error.message, path);
			throw new FileNotFoundError('file not found', path);
		}
	}

	async saveAsync(path: string, content: string | Buffer, append?: boolean | undefined): Promise<string | Buffer> {
		const resolvedPath = resolve(this.prefix, path);
		const flag = append ? 'a' : 'w';
		await writeFile(resolvedPath, content, { flag });
		return resolvedPath;
	}

	async deleteAsync(path: string): Promise<string | Buffer> {
		const resolvedPath = resolve(this.prefix, path);
		await unlink(resolvedPath);
		return resolvedPath;
	}

	load(path: string): string | Buffer {
		try {
			const resolvedPath = resolve(this.prefix, path);
			return readFileSync(resolvedPath).toString();
		} catch (error: unknown) {
			if (error instanceof Error) throw new FileNotFoundError(error.message, path);
			throw new FileNotFoundError('file not found', path);
		}
	}

	save(path: string, content: string | Buffer, append?: boolean | undefined): string | Buffer {
		const resolvedPath = resolve(this.prefix, path);
		const flag = append ? 'a' : 'w';
		writeFileSync(resolvedPath, content, { flag });
		return resolvedPath;
	}
}
