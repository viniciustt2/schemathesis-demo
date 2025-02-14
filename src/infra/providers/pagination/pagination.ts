import { z } from 'zod';

export const PaginationSchema = z.object({
	total: z.number().int(),
	limit: z.number().int(),
	pages: z.number().int(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export type CountableFunction<Filter> = (filter: Filter) => Promise<number>;

export type CountableRepository<Filter, CountFunctionName extends string> = {
	[K in CountFunctionName]: CountableFunction<Filter>;
};

export interface FilterWithMaybeLimit {
	limit?: number;
}
