import type { AsyncFileStorage } from '../file-storage';
import type { OpenAPIFile } from './open-api-file';
import type { OpenAPIObject as OpenAPIObject30 } from 'openapi3-ts/oas30';
import type { OpenAPIObject as OpenAPIObject31 } from 'openapi3-ts/oas31';

export class OpenAPIFileStorageAdapter implements OpenAPIFile {
	constructor(
		private fileName: string,
		private storage: AsyncFileStorage,
	) {}

	async save(file: OpenAPIObject30 | OpenAPIObject31): Promise<void> {
		const serialized = JSON.stringify(file, undefined, 2);
		await this.storage.saveAsync(this.fileName, serialized);
	}
}
