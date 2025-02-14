import type { Request, Response } from 'express';
import type { OpenAPIObject } from 'openapi3-ts/oas30';

/**
 * Serves an openapi document raw, to be used in introspection engines
 * @param document A generated OpenAPI registry
 * @returns A controller that just serves it as if it was a static file
 */
export function serveRawSwaggerDocument(document: OpenAPIObject) {
	return function swaggerRawFileController(_request: Request, response: Response) {
		response.send(document);
	};
}
