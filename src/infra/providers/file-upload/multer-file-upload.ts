import type { RequestHandler, Request } from 'express';
import type { FileUploadProvider, UploadedFile } from './file-upload';
import multer, { type Multer, type StorageEngine } from 'multer';

function isS3FileWithLocation(file: Express.Multer.File): file is Express.Multer.File & { location: string } {
	return 'location' in file && typeof file.location === 'string';
}

/**
 * Implementation of FileUploadProvider using Multer.
 */
export class MulterFileUploadProvider implements FileUploadProvider {
	private multerInstance: Multer;
	private fieldName: string;
	private multipleFiles: boolean;

	/**
	 * Constructs a Multer-based file upload provider.
	 * @param fieldName The name of the form field for file uploads.
	 * @param multipleFiles Whether multipleFiles files should be allowed.
	 * @param storage Optional custom Multer storage engine.
	 */
	constructor(fieldName = 'file', multipleFiles = false, storage?: StorageEngine) {
		this.fieldName = fieldName;
		this.multipleFiles = multipleFiles;
		this.multerInstance = multer({
			storage: storage ?? multer.memoryStorage(),
		});
	}

	/**
	 * Creates an Express middleware for handling file uploads.
	 * @returns An Express middleware function for file uploads.
	 */
	createMiddleware(): RequestHandler {
		if (this.multipleFiles) return this.multerInstance.array(this.fieldName);
		return this.multerInstance.single(this.fieldName);
	}

	/**
	 * Extracts the uploaded file(s) from the Express request.
	 * @param request The Express request object.
	 * @returns An array of UploadedFile objects, or an empty array if no files were uploaded.
	 */
	getFilesFromRequest(request: Request): UploadedFile[] {
		let multerFiles: Express.Multer.File[] = [];

		if (request.file) {
			multerFiles = [request.file];
		} else if (Array.isArray(request.files)) {
			multerFiles = request.files;
		} else if (request.files && typeof request.files === 'object') {
			multerFiles = Object.values(request.files).flat();
		}

		return multerFiles.map((file: Express.Multer.File): UploadedFile => {
			const filePath = isS3FileWithLocation(file) ? file.location : file.path;
			return {
				fieldname: file.fieldname,
				originalName: file.originalname,
				mimeType: file.mimetype,
				size: file.size,
				buffer: file.buffer as Buffer<ArrayBuffer>,
				path: filePath,
			};
		});
	}
}
