interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null | undefined;
	endCursor: string | null | undefined;
}

interface UsePaginationOptions {
	pageInfo: PageInfo | null | undefined;
	totalCount: number;
	pageSize?: number;
	currentPage?: number;
}

interface UsePaginationReturn {
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null | undefined;
	endCursor: string | null | undefined;
	previousPage: number | undefined;
	nextPage: number | undefined;
}

export function usePagination({
	pageInfo,
	totalCount,
	pageSize = 10,
	currentPage: currentPageParam,
}: UsePaginationOptions): UsePaginationReturn {
	// Calculate total pages - ensure at least 1 page even if no items
	const totalPages =
		totalCount > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;
	// Current page from param, default to 1 if not set
	const currentPage = currentPageParam ?? 1;

	const hasNextPage = pageInfo?.hasNextPage ?? false;
	const hasPreviousPage = pageInfo?.hasPreviousPage ?? false;
	const startCursor = pageInfo?.startCursor;
	const endCursor = pageInfo?.endCursor;

	const previousPage = currentPage > 1 ? currentPage - 1 : undefined;
	const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;

	return {
		totalPages,
		currentPage,
		hasNextPage,
		hasPreviousPage,
		startCursor,
		endCursor,
		previousPage,
		nextPage,
	};
}
