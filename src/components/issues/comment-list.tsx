import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { commentList_comments$key } from "@/utils/relay/__generated__/commentList_comments.graphql";
import { graphql, useFragment } from "react-relay";
import { CommentItem } from "./comment-item";

const COMMENT_LIST_FRAGMENT = graphql`
	fragment commentList_comments on IssueCommentConnection {
		totalCount
		edges {
			node {
				id
				...commentItem_comment
			}
		}
	}
`;

interface CommentListProps {
	commentsPages: commentList_comments$key[];
	totalCount?: number | null;
	hasNextPage?: boolean;
	isLoadingMore?: boolean;
	onLoadMore?: () => void;
}

// Component to render comments from a single page
function CommentPageItems({
	comments,
}: {
	comments: commentList_comments$key;
}) {
	const data = useFragment(COMMENT_LIST_FRAGMENT, comments);

	const commentNodes =
		data.edges
			?.map((edge) => edge?.node)
			.filter(
				(node): node is NonNullable<typeof node> =>
					node != null && node.id != null,
			) ?? [];

	return (
		<>
			{commentNodes.map((comment) => (
				<CommentItem key={comment.id} comment={comment} />
			))}
		</>
	);
}

// Component to get totalCount from first page
function useFirstPageTotalCount(commentsPages: commentList_comments$key[]) {
	const firstPage = commentsPages[0] ?? null;
	const data = useFragment(COMMENT_LIST_FRAGMENT, firstPage);
	return data?.totalCount ?? null;
}

export function CommentList({
	commentsPages,
	totalCount,
	hasNextPage,
	isLoadingMore,
	onLoadMore,
}: CommentListProps) {
	const firstPageTotalCount = useFirstPageTotalCount(commentsPages);
	const displayTotalCount = totalCount ?? firstPageTotalCount;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Comments
					{displayTotalCount != null && (
						<span className="text-base font-normal text-muted-foreground ml-2">
							({displayTotalCount})
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardPanel>
				{commentsPages.length === 0 || displayTotalCount === 0 ? (
					<div className="text-center text-muted-foreground py-8">
						No comments yet.
					</div>
				) : (
					<TooltipProvider>
						<div className="space-y-4">
							{commentsPages.map((pageRef, pageIndex) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Pages are append-only, index is stable
								<CommentPageItems key={pageIndex} comments={pageRef} />
							))}
						</div>
					</TooltipProvider>
				)}
				{hasNextPage && onLoadMore && (
					<div className="mt-4 flex justify-center">
						<Button
							variant="outline"
							onClick={onLoadMore}
							disabled={isLoadingMore}
						>
							{isLoadingMore && (
								<Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
							)}
							<span
								className={cn({
									"blur-[2px] opacity-30 scale-95 transition duration-150":
										isLoadingMore,
								})}
							>
								Load More
							</span>
						</Button>
					</div>
				)}
			</CardPanel>
		</Card>
	);
}
