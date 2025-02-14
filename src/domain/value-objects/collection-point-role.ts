import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type ContactRoleEnum = z.infer<typeof ContactRole.schema>;
export class ContactRole {
	readonly value: ContactRoleEnum;

	static readonly enum = Object.freeze({ ADMIN: 'ADMIN', MANAGER: 'MANAGER' });
	static readonly schema = z.nativeEnum(ContactRole.enum).openapi('ContactRole', {
		description: 'O cargo do contato',
	});

	private constructor(type: ContactRoleEnum) {
		this.value = type;
	}

	static create(type: ContactRoleEnum) {
		return new ContactRole(type);
	}

	static maybeCreate(type: ContactRoleEnum | undefined): ContactRole | undefined {
		return type ? ContactRole.create(type) : undefined;
	}

	static fromUnknown(unknown: unknown): ContactRole {
		const data = ContactRole.schema.parse(unknown);
		return new ContactRole(data);
	}

	serialize() {
		return this.value;
	}
}
