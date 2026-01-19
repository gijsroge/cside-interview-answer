import { RepositoryHeader } from "@/components/repository/repository-header";
import { RepositoryIssuesList } from "@/components/repository/repository-issues-list";
import { Button } from "@/components/ui/button";
import type { repositoryLayoutIssuesQuery } from "@/utils/relay/__generated__/repositoryLayoutIssuesQuery.graphql";
import type { repositoryQuery } from "@/utils/relay/__generated__/repositoryQuery.graphql";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { goBackTo } from "go-back-to";
import { fetchQuery, graphql } from "react-relay";
import { z } from "zod";

const REPOSITORY_LAYOUT_QUERY = graphql`
	query repositoryQuery($owner: String!, $name: String!) {
		repository(owner: $owner, name: $name) {
			id
			...repositoryHeader_repository
		}
	}
`;

const REPOSITORY_ISSUES_QUERY = graphql`
	query repositoryLayoutIssuesQuery(
		$owner: String!
		$name: String!
		$first: Int
		$after: String
		$last: Int
		$before: String
	) {
		repository(owner: $owner, name: $name) {
			issues(
				first: $first
				after: $after
				last: $last
				before: $before
				states: [OPEN]
				orderBy: { field: CREATED_AT, direction: DESC }
			) {
				totalCount
				pageInfo {
					endCursor
					startCursor
					hasNextPage
					hasPreviousPage
				}
				edges {
					node {
						id
						number
						...issueCard_issue
					}
				}
			}
		}
	}
`;

const issuesSchema = z.object({
	after: z.string().optional(),
	before: z.string().optional(),
	page: z.coerce.number().int().positive().optional(),
});

export const Route = createFileRoute("/repository/$owner/$name")({
	component: RepositoryLayout,
	validateSearch: zodValidator(issuesSchema),
	loaderDeps: ({ search: { after, before, page } }) => ({
		after,
		before,
		page,
	}),
	loader: async ({
		context: { relayEnvironment },
		params,
		deps: { after, before },
	}) => {
		const [repoData, issuesData] = await Promise.all([
			fetchQuery<repositoryQuery>(
				relayEnvironment,
				REPOSITORY_LAYOUT_QUERY,
				{ owner: params.owner, name: params.name },
				{ fetchPolicy: "store-or-network" },
			).toPromise(),

			fetchQuery<repositoryLayoutIssuesQuery>(
				relayEnvironment,
				REPOSITORY_ISSUES_QUERY,
				{
					owner: params.owner,
					name: params.name,
					first: before ? null : 10,
					after: before ? null : after || null,
					last: before ? 10 : null,
					before: before || null,
				},
				{ fetchPolicy: "store-or-network" },
			).toPromise(),
		]);

		if (!repoData) {
			throw new Error("Failed to fetch repository data");
		}

		return { repoData, issuesData };
	},
	head: ({ params }) => ({
		meta: [
			{
				title: `${params.owner}/${params.name} | cside`,
			},
		],
	}),
});

function RepositoryLayout() {
	const { repoData, issuesData } = Route.useLoaderData();
	const repo = repoData?.repository;
	const search = Route.useSearch();
	const { owner, name } = Route.useParams();
	const navigate = useNavigate();

	if (!repo) {
		return (
			<div className="container mx-auto p-4 md:p-6 max-w-4xl">
				<div className="text-center text-muted-foreground py-8">
					Repository not found.
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-4 container mx-auto p-4 md:p-6 max-w-4xl">
			<div className="flex items-center gap-4">
				<Button
					onClick={() =>
						goBackTo({
							targetPathname: "/",
							fallbackCallback: () => {
								navigate({
									to: "/",
								});
							},
						})
					}
					variant="outline"
					size="lg"
				>
					← Back
				</Button>
			</div>

			<RepositoryHeader repository={repo} />

			{issuesData && (
				<RepositoryIssuesList
					data={issuesData}
					owner={owner}
					name={name}
					search={search}
				/>
			)}

			<Outlet />
		</div>
	);
}
