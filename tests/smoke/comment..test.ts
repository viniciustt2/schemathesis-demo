import { Comment } from '../../src/domain/value-objects/comment';

describe('[smoke] basic comment operations', () => {
	it('should create a comment and serialize', () => {
		expect.hasAssertions();
		const comment = Comment.create('Comentário de exemplo para a tarefa.');
		const serialized = comment.serialize();
		expect(serialized).toMatchInlineSnapshot('"Comentário de exemplo para a tarefa."');
	});

	it('should create an empty comment and serialize', () => {
		expect.hasAssertions();
		const comment = Comment.create(undefined);
		const serialized = comment.serialize();
		expect(serialized).toMatchInlineSnapshot('undefined');
	});
});
