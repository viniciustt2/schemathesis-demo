import type { z } from 'zod';
import { GenericFiltersSchema } from './generic-filters';

export const CollectionPointFiltersSchema = GenericFiltersSchema.extend({});

export type CollectionPointFiltersType = z.infer<typeof CollectionPointFiltersSchema>;
