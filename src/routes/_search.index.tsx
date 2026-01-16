import { RepositorySearchCard } from "@/components/search/repository-search-card";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";
import { Pagination } from "@/components/ui/pagination";
import type { SearchIndexQuery } from "@/utils/relay/__generated__/SearchIndexQuery.graphql";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { fetchQuery, graphql } from "react-relay";
import { z } from "zod";

const searchSchema = z.object({
	query: z.string().optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	page: z.coerce.number().int().positive().optional(),
});

const SEARCH_QUERY = graphql`
	query SearchIndexQuery(
		$query: String!
		$first: Int
		$after: String
		$last: Int
		$before: String
	) {
		search(
			query: $query
			type: REPOSITORY
			first: $first
			after: $after
			last: $last
			before: $before
		) {
			repositoryCount
			pageInfo {
				endCursor
				startCursor
				hasNextPage
				hasPreviousPage
			}
			edges {
				node {
					... on Repository {
						id
						url
						name
						owner {
							login
						}
						...repositorySearchCard_repository
					}
				}
			}
		}
	}
`;

export const Route = createFileRoute("/_search/")({
	component: SearchResultsPage,
	pendingComponent: SearchResultsSkeleton,
	validateSearch: zodValidator(searchSchema),
	loaderDeps: ({ search: { query, after, before } }) => ({
		query,
		after,
		before,
	}),
	loader: async ({
		context: { relayEnvironment },
		deps: { query, after, before },
	}) => {
		const data = await fetchQuery<SearchIndexQuery>(
			relayEnvironment,
			SEARCH_QUERY,
			{
				query: (query?.trim() ?? "React").trim(),
				first: before ? null : 10,
				after: before ? null : after || null,
				last: before ? 10 : null,
				before: before || null,
			},
			{ fetchPolicy: "store-or-network" },
		).toPromise();

		if (!data) {
			throw new Error("Failed to fetch search data");
		}

		return data;
	},
	head: ({ match }) => {
		const query = match?.search?.query;
		return {
			meta: [
				{
					title: query ? `${query} | cside` : "cside | Search Repositories",
				},
			],
		};
	},
});

function SearchResultsPage() {
	const { query } = Route.useSearch();
	const search = Route.useSearch();
	const data = Route.useLoaderData();

	const repositories =
		data.search.edges?.filter((edge) => edge?.node?.id && edge?.node?.name) ||
		[];

	if (repositories.length === 0) {
		return (
			<div className="text-center text-muted-foreground py-8">
				No repositories found. Try a different search term.
			</div>
		);
	}

	return (
		<>
			{data.search.repositoryCount != null && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Found {data.search.repositoryCount.toLocaleString()} repositories
					</div>
					<Pagination
						pageInfo={data.search.pageInfo}
						totalCount={data.search.repositoryCount}
						currentPage={search.page}
						to="/"
						search={{ query: query || undefined }}
						showPagination={
							data.search.pageInfo?.hasNextPage ||
							data.search.pageInfo?.hasPreviousPage
						}
					/>
				</div>
			)}
			<div className="space-y-4 mb-6">
				{repositories.map((edge) => {
					const repo = edge?.node;
					if (!repo || !repo.id || !repo.name) return null;

					const owner = repo.owner?.login;
					if (!owner) return null;

					return (
						<Link
							key={repo.id}
							to="/repository/$owner/$name"
							params={{ owner, name: repo.name }}
							className="block"
							preload="viewport"
						>
							<RepositorySearchCard repository={repo} />
						</Link>
					);
				})}
				<Pagination
					pageInfo={data.search.pageInfo}
					totalCount={data.search.repositoryCount}
					currentPage={search.page}
					to="/"
					search={{ query: query || undefined }}
					showPagination={
						data.search.pageInfo?.hasNextPage ||
						data.search.pageInfo?.hasPreviousPage
					}
				/>
			</div>
		</>
	);
}
