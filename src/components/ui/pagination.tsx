import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePagination } from "@/hooks/use-pagination";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null | undefined;
	endCursor: string | null | undefined;
}

interface PaginationProps {
	pageInfo: PageInfo | null | undefined;
	totalCount: number;
	currentPage?: number;
	pageSize?: number;
	to: string;
	params?: Record<string, string>;
	search?: Record<string, unknown>;
	showPagination?: boolean;
}

export function Pagination({
	pageInfo,
	totalCount,
	currentPage,
	pageSize = 10,
	to,
	params,
	search = {},
	showPagination = true,
}: PaginationProps) {
	const matchRoute = useMatchRoute();
	const {
		totalPages,
		currentPage: page,
		hasNextPage,
		hasPreviousPage,
		startCursor,
		endCursor,
		previousPage,
		nextPage,
	} = usePagination({
		pageInfo,
		totalCount,
		pageSize,
		currentPage,
	});

	// Check if previous page route is pending
	const isNavigatingToPrevious = !!matchRoute({
		to,
		params,
		search: {
			...search,
			before: startCursor || undefined,
			after: undefined,
			page: previousPage,
		},
		pending: true,
	});

	// Check if next page route is pending
	const isNavigatingToNext = !!matchRoute({
		to,
		params,
		search: {
			...search,
			after: endCursor || undefined,
			before: undefined,
			page: nextPage,
		},
		pending: true,
	});

	if (!showPagination && !hasNextPage && !hasPreviousPage) {
		return null;
	}

	return (
		<div className="flex items-center gap-x-3 max-md:gap-x-5 gap-y-1.5 max-md:gap-y-3 justify-end flex-wrap">
			<span className="text-sm text-muted-foreground">
				Page {page} of {Intl.NumberFormat("en-US").format(totalPages)}
			</span>
			<div className="flex items-center gap-1 max-md:gap-5.5 max-md:pr-2">
				<Button
					size="icon"
					variant="outline"
					className="md:h-6 md:w-6 h-8 w-8 max-md:-m-2 p-0"
					disabled={!hasPreviousPage || !startCursor || isNavigatingToPrevious}
					render={
						<Link
							to={to}
							params={params}
							preload="render"
							resetScroll={false}
							search={{
								...search,
								before: startCursor || undefined,
								after: undefined,
								page: previousPage,
							}}
						/>
					}
				>
					{isNavigatingToPrevious ? (
						<Spinner className="h-3 w-3" />
					) : (
						<ChevronLeft className="h-3 w-3" />
					)}
				</Button>
				<Button
					size="icon"
					variant="outline"
					className="md:h-6 md:w-6 h-8 w-8 max-md:-m-2 p-0"
					disabled={!hasNextPage || !endCursor || isNavigatingToNext}
					render={
						<Link
							to={to}
							params={params}
							preload="render"
							resetScroll={false}
							search={{
								...search,
								after: endCursor || undefined,
								before: undefined,
								page: nextPage,
							}}
						/>
					}
				>
					{isNavigatingToNext ? (
						<Spinner className="h-3 w-3" />
					) : (
						<ChevronRight className="h-3 w-3" />
					)}
				</Button>
			</div>
		</div>
	);
}
