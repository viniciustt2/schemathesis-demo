import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);

export type CommentType = z.infer<typeof Comment.schema>;
export class Comment {
	readonly value: string | undefined;

	static readonly schema = z
		.string()
		.max(250, 'Limite de caracteres excedido: comentários de tarefas tem um limite de 250 caracteres')
		.trim()
		.optional()
		.openapi('Comment', { description: 'comentário' });

	private constructor(comment: string | undefined) {
		this.value = comment;
	}

	static create(comment: string | undefined) {
		return new Comment(comment);
	}

	static fromUnknown(unknown: unknown): Comment {
		const data = Comment.schema.parse(unknown);
		return new Comment(data);
	}

	serialize() {
		return this.value;
	}
}
