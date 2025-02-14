import type { CollectionsRepository } from '../domain/repositories/collections.repository';
import { ResourceNotFoundProblem } from '../infra/errors/resource-not-found';

export class CollectionService {
	constructor(private collectionsRepository: CollectionsRepository) {}

	async getById(id: string) {
		const collection = await this.collectionsRepository.findById(id);
		if (!collection) throw ResourceNotFoundProblem.error('Coleta nao encontrada', 'id');
		return collection.serialize();
	}
}
