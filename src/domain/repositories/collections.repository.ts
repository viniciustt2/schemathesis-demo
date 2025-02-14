import type { Collection } from '../entities/collection';

export type CollectionsRepository = {
	findById(id: string): Promise<Collection | null>;
};
