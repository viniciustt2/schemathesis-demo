import { z } from 'zod';

export type GenericFiltersType = z.infer<typeof GenericFiltersSchema>;
export const GenericFiltersSchema = z.object({
	limit: z.coerce.number().int().nonnegative().default(12).optional(),
	offset: z.coerce.number().int().nonnegative().default(0).optional(),
});
