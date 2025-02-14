import type { RequestHandler } from 'express';
import type { FileUploadProvider, UploadedFile } from './file-upload';
import { noopMiddleware } from '../../../presentation/http-rest/middlewares/noop';

export class FakeFileUploadProvider implements FileUploadProvider {
	createMiddleware(): RequestHandler {
		return noopMiddleware;
	}

	getFilesFromRequest(): UploadedFile[] {
		return [
			{
				fieldname: 'avatar',
				originalName: 'avatar.png',
				mimeType: 'image/png',
				size: 2048,
				buffer: Buffer.from('This is some fake image data', 'utf8'),
				path: '/uploads/avatar.png',
			},
		];
	}
}
