import type { Request, RequestHandler } from 'express';

/**
 * Represents a file uploaded via the middleware.
 */
export interface UploadedFile {
	/** Name of the field in the form data */
	fieldname: string;
	/** Original file name as provided by the client */
	originalName: string;
	/** MIME type of the file */
	mimeType: string;
	/** Size of the file in bytes */
	size: number;
	/** File buffer if stored in memory */
	buffer?: Buffer<ArrayBuffer>;
	/** File path if stored on disk */
	path?: string;
}

/**
 * Interface for file upload providers.
 */
export interface FileUploadProvider {
	/**
	 * Creates an Express middleware for handling file uploads.
	 * @returns An Express middleware function for file uploads.
	 */
	createMiddleware(): RequestHandler;

	/**
	 * Extracts the uploaded file(s) from the request.
	 * @param req The Express request object.
	 * @returns An array of uploaded files, or an empty array if no files were uploaded.
	 */
	getFilesFromRequest(req: Request): UploadedFile[];
}
