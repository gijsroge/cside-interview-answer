import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import type { commentItem_comment$key } from "@/utils/relay/__generated__/commentItem_comment.graphql";
import { graphql, useFragment } from "react-relay";

const COMMENT_ITEM_FRAGMENT = graphql`
	fragment commentItem_comment on IssueComment {
		id
		bodyText
		createdAt
		author {
			login
			avatarUrl
		}
	}
`;

interface CommentItemProps {
	comment: commentItem_comment$key;
}

export function CommentItem({ comment }: CommentItemProps) {
	const data = useFragment(COMMENT_ITEM_FRAGMENT, comment);

	return (
		<div className="border-b pb-4 last:border-b-0 last:pb-0">
			<div className="flex gap-3 items-start">
				<Tooltip>
					<TooltipTrigger className="shrink-0">
						{data.author?.avatarUrl ? (
							<img
								src={data.author.avatarUrl}
								alt={data.author.login || ""}
								className="w-10 h-10 rounded-full"
							/>
						) : (
							<span className="w-10 h-10 block rounded-full bg-muted" />
						)}
					</TooltipTrigger>
					{data.author?.login && (
						<TooltipPopup>{data.author.login}</TooltipPopup>
					)}
				</Tooltip>
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<span className="font-medium">
							{data.author?.login || "Unknown"}
						</span>
						{data.createdAt && (
							<span className="text-sm text-muted-foreground">
								{new Date(data.createdAt).toLocaleString()}
							</span>
						)}
					</div>
					{data.bodyText && (
						<div className="whitespace-pre-wrap text-sm wrap-break-word">
							{data.bodyText}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
