import type { CollectionPoint } from '../entities/collection-point';
import type { CollectionPointFiltersType } from '../value-objects/filters';

export interface CollectionPointsRepository {
	getById(collectionPointId: string): Promise<CollectionPoint>;
	save(collectionPoint: CollectionPoint): Promise<void>;
	list(filters: CollectionPointFiltersType): Promise<CollectionPoint[]>;
	count(filters: CollectionPointFiltersType): Promise<number>;
}
