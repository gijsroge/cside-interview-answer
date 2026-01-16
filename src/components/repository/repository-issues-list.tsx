import { IssueCard } from "@/components/issues/issue-card";
import { Pagination } from "@/components/ui/pagination";
import type { repositoryLayoutIssuesQuery$data } from "@/utils/relay/__generated__/repositoryLayoutIssuesQuery.graphql";
import { Link } from "@tanstack/react-router";

interface RepositoryIssuesListProps {
	data: repositoryLayoutIssuesQuery$data;
	owner: string;
	name: string;
	search: {
		after?: string;
		before?: string;
		page?: number;
	};
}

export function RepositoryIssuesList({
	data,
	owner,
	name,
	search,
}: RepositoryIssuesListProps) {
	const issues =
		data.repository?.issues?.edges?.filter(
			(edge): edge is NonNullable<typeof edge> => edge?.node != null,
		) || [];
	const pageInfo = data.repository?.issues?.pageInfo;
	const totalCount = data.repository?.issues?.totalCount ?? 0;

	return (
		<>
			{data.repository?.issues?.totalCount != null && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Found {data.repository.issues.totalCount.toLocaleString()} issues
					</div>
					<Pagination
						pageInfo={pageInfo}
						totalCount={totalCount}
						currentPage={search.page}
						to="/repository/$owner/$name"
						params={{ owner, name }}
						showPagination={pageInfo?.hasNextPage || pageInfo?.hasPreviousPage}
					/>
				</div>
			)}

			<div className="space-y-4">
				{issues.length > 0 &&
					issues.map((edge) => {
						const issue = edge.node;
						if (!issue) return null;

						return (
							<Link
								key={issue.id}
								to="/repository/$owner/$name/$number"
								params={{ owner, name, number: String(issue.number) }}
								search={{
									after: search.after,
									before: search.before,
								}}
								resetScroll={false}
								className="block"
								preload="viewport"
							>
								<IssueCard issue={issue} />
							</Link>
						);
					})}
			</div>

			<Pagination
				pageInfo={pageInfo}
				totalCount={totalCount}
				currentPage={search.page}
				to="/repository/$owner/$name"
				params={{ owner, name }}
				showPagination={pageInfo?.hasNextPage || pageInfo?.hasPreviousPage}
			/>
		</>
	);
}
