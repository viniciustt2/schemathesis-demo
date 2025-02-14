import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type UserType = z.infer<typeof User.schema>;
export class User {
	readonly id: string;
	readonly fullName: string;
	readonly initials: string;
	static readonly schema = z
		.object({
			id: z.string().uuid().describe('uuid4 do usuário'),
			fullName: z.string().describe('nome do usuário'),
			initials: z.string().min(2).max(2).describe('iniciais do usuário'),
		})
		.openapi('User', { description: 'um usuário do sistema' });

	private constructor(user: UserType) {
		this.id = user.id;
		this.fullName = user.fullName;
		this.initials = user.initials;
	}

	static create(user: Optional<UserType, 'id'>) {
		return new User({
			id: user.id ?? crypto.randomUUID(),
			fullName: user.fullName,
			initials: user.initials,
		});
	}

	static fromUnknown(unknown: unknown): User {
		const data = User.schema.parse(unknown);
		return new User(data);
	}

	serialize() {
		return {
			id: this.id,
			fullName: this.fullName,
			initials: this.initials,
		};
	}
}
