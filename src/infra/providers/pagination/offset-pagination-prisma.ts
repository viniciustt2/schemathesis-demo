import { type Pagination, type CountableRepository, type FilterWithMaybeLimit, PaginationSchema } from './pagination';

export class OffsetPaginationPrisma implements Pagination {
	readonly total: number;
	readonly limit: number;
	readonly pages: number;

	private constructor(total: number, limit: number, pages: number) {
		this.total = total;
		this.limit = limit;
		this.pages = pages;
	}

	static async from<Filter extends FilterWithMaybeLimit, CountFunctionName extends string>(
		filter: Filter,
		repository: CountableRepository<Filter, CountFunctionName>,
		countFunction: CountFunctionName = 'count' as CountFunctionName,
	): Promise<OffsetPaginationPrisma> {
		const total = await repository[countFunction](filter);
		const limit = filter.limit ?? 12;
		const pages = Math.ceil(total / limit);

		const paginationData = { total, limit, pages };
		PaginationSchema.parse(paginationData);

		return new OffsetPaginationPrisma(total, limit, pages);
	}
}
