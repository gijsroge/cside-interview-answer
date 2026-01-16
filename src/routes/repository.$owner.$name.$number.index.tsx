import { CommentList } from "@/components/issues/comment-list";
import type { repositoryNumberIndexQuery } from "@/utils/relay/__generated__/repositoryNumberIndexQuery.graphql";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { fetchQuery, graphql } from "react-relay";

const COMMENTS_QUERY = graphql`
	query repositoryNumberIndexQuery(
		$owner: String!
		$name: String!
		$number: Int!
		$commentsFirst: Int!
		$commentsAfter: String
	) {
		repository(owner: $owner, name: $name) {
			issue(number: $number) {
				comments(first: $commentsFirst, after: $commentsAfter) {
					...commentList_comments
					pageInfo {
						endCursor
						hasNextPage
					}
				}
			}
		}
	}
`;

async function fetchCommentsPage({
	relayEnvironment,
	owner,
	name,
	number,
	pageParam,
}: {
	relayEnvironment: Parameters<typeof fetchQuery>[0];
	owner: string;
	name: string;
	number: number;
	pageParam: string | null;
}) {
	const result = await fetchQuery<repositoryNumberIndexQuery>(
		relayEnvironment,
		COMMENTS_QUERY,
		{
			owner,
			name,
			number,
			commentsFirst: 5,
			commentsAfter: pageParam,
		},
		{ fetchPolicy: "store-or-network" },
	).toPromise();

	if (!result?.repository?.issue?.comments) {
		throw new Error("Failed to fetch comments");
	}

	const comments = result.repository.issue.comments;

	return {
		comments,
		nextCursor: comments.pageInfo?.hasNextPage
			? (comments.pageInfo.endCursor ?? null)
			: null,
	};
}

export const Route = createFileRoute("/repository/$owner/$name/$number/")({
	component: Comments,
	loader: async ({ context: { relayEnvironment }, params }) => {
		const page = await fetchCommentsPage({
			relayEnvironment,
			owner: params.owner,
			name: params.name,
			number: parseInt(params.number, 10),
			pageParam: null,
		});

		return {
			initialPage: page,
		};
	},
});

function Comments() {
	const { initialPage } = Route.useLoaderData();
	const { owner, name, number } = Route.useParams();
	const { relayEnvironment } = useRouteContext({
		from: "/repository/$owner/$name/$number/",
	});

	const issueNumber = parseInt(number, 10);

	const {
		data: commentsData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["issue-comments", owner, name, issueNumber],
		queryFn: ({ pageParam }) =>
			fetchCommentsPage({
				relayEnvironment,
				owner,
				name,
				number: issueNumber,
				pageParam: pageParam as string | null,
			}),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialData: initialPage
			? {
					pages: [initialPage],
					pageParams: [null], // The first page was fetched with null as pageParam
				}
			: undefined,
	});

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	// Combine all pages' comments together
	const allComments = commentsData?.pages.map((page) => page.comments) ?? [];

	// Get totalCount from the first page (it's the same across all pages)
	return (
		<CommentList
			commentsPages={allComments}
			hasNextPage={hasNextPage ?? false}
			isLoadingMore={isFetchingNextPage}
			onLoadMore={handleLoadMore}
		/>
	);
}
