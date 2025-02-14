import type { S3 } from '@aws-sdk/client-s3';
import type { Logger } from 'winston';
import type { AsyncFileStorage } from './file-storage';
import { FileNotFoundError } from './errors';

type AmazonS3 = Pick<S3, 'getObject' | 'putObject' | 'deleteObject' | 'config'>;

export class S3FileStorage implements AsyncFileStorage {
	private bucket: string;
	private amazonS3: AmazonS3;
	private fallback?: AsyncFileStorage;
	private logger: Logger;

	constructor(amazonS3: AmazonS3, bucket: string, logger: Logger, fallback?: AsyncFileStorage) {
		this.bucket = bucket;
		this.logger = logger;
		this.amazonS3 = amazonS3;
		this.fallback = fallback;
	}

	async loadAsync(key: string): Promise<string | Buffer> {
		try {
			const result = await this.amazonS3.getObject({
				Bucket: this.bucket,
				Key: key,
			});

			if (!result.Body) throw new FileNotFoundError('File not found on s3', key);
			const byteArray = await result.Body.transformToByteArray();
			return Buffer.from(byteArray);
		} catch (error: unknown) {
			this.logger.warn('failure to retrieve file', { error, key });
			throw error;
		}
	}

	async deleteAsync(key: string): Promise<string | Buffer> {
		try {
			await this.amazonS3.deleteObject({
				Bucket: this.bucket,
				Key: key,
			});
		} catch (error: unknown) {
			this.logger.warn('failure on deleting file', { error, key });
			throw error;
		}

		return key;
	}

	async saveAsync(key: string, content: string | Buffer): Promise<string | Buffer> {
		try {
			await this.amazonS3.putObject({
				Bucket: this.bucket,
				Key: key,
				Body: content,
			});
		} catch (error: unknown) {
			this.logger.warn('file upload to s3 failed, saving to fallback', { error, key });
			await this.fallback?.saveAsync(key, content);
			throw error;
		}

		return key;
	}
}
