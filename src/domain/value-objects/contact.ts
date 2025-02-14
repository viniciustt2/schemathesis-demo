import { z } from 'zod';
import { ContactRole } from './collection-point-role';

export type ContactType = z.infer<typeof Contact.schema>;
export class Contact {
	readonly name: string;
	readonly role?: ContactRole;
	readonly phone: string;
	readonly email: string;

	static schema = z.object({
		name: z.string().describe('Nome do contato'),
		role: ContactRole.schema.optional().describe('Cargo do contato'),
		phone: z.string().describe('Telefone do contato'),
		email: z.string().describe('E-mail do contato'),
	});

	private constructor(contact: ContactType) {
		this.name = contact.name;
		this.role = ContactRole.maybeCreate(contact.role);
		this.phone = contact.phone;
		this.email = contact.email;
	}

	static create(contact: ContactType): Contact {
		return new Contact(contact);
	}

	static fromUnknown(unknown: unknown): Contact {
		const data = Contact.schema.parse(unknown);
		return new Contact(data);
	}

	static fromJSON(json: string): Contact {
		const unknown = JSON.parse(json);
		const data = Contact.schema.parse(unknown);
		return new Contact(data);
	}

	static toJSON(contact: Contact): string {
		return JSON.stringify(contact.serialize());
	}

	serialize() {
		return {
			name: this.name,
			role: this.role?.serialize(),
			phone: this.phone,
			email: this.email,
		};
	}
}
