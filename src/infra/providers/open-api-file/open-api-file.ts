import type { OpenAPIObject as OpenAPIObject30 } from 'openapi3-ts/oas30';
import type { OpenAPIObject as OpenAPIObject31 } from 'openapi3-ts/oas31';

export interface OpenAPIFile {
	/**
	 * Saves the openAPI file, so that it will go in the build process
	 * @param file OpenAPI file generated using openapi3-ts
	 */
	save(file: OpenAPIObject31 | OpenAPIObject30): Promise<void>;
}
