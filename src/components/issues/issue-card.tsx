import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import type { issueCard_issue$key } from "@/utils/relay/__generated__/issueCard_issue.graphql";
import { graphql, useFragment } from "react-relay";
import TablerMessageCircle from "~icons/tabler/message-circle";
import { LabelBadge } from "./label-badge";

const ISSUE_CARD_FRAGMENT = graphql`
	fragment issueCard_issue on Issue {
		number
		title
		bodyText
		createdAt
		state
		comments {
			totalCount
		}
		labels(first: 10) {
			nodes {
				id
				name
				color
			}
		}
	}
`;

interface IssueCardProps {
	issue: issueCard_issue$key;
}

export function IssueCard({ issue }: IssueCardProps) {
	const data = useFragment(ISSUE_CARD_FRAGMENT, issue);

	const labels =
		data.labels?.nodes?.filter(
			(node): node is NonNullable<typeof node> =>
				node != null &&
				node.id != null &&
				node.name != null &&
				node.color != null,
		) ?? [];

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between gap-4 min-w-0">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg">
							#{data.number} {data.title}
						</CardTitle>
						{data.bodyText && (
							<CardDescription className="mt-4 line-clamp-2 text-wrap">
								{data.bodyText}
							</CardDescription>
						)}
					</div>
					<Badge
						className="lowercase"
						variant={data.state === "OPEN" ? "success" : "secondary"}
					>
						{data.state}
					</Badge>
				</div>
			</CardHeader>
			<CardPanel>
				<div className="flex items-center gap-4 flex-wrap">
					{data.createdAt && (
						<span className="text-sm text-muted-foreground">
							Created{" "}
							{new Intl.DateTimeFormat("en-US").format(
								new Date(data.createdAt),
							)}
						</span>
					)}
					{data.comments?.totalCount != null && (
						<span className="text-sm text-muted-foreground flex items-center gap-1">
							<TablerMessageCircle className="size-4" />{" "}
							{data.comments.totalCount.toLocaleString()}{" "}
							{data.comments.totalCount === 1 ? "comment" : "comments"}
						</span>
					)}
					{labels.length > 0 && (
						<div className="flex gap-2 flex-wrap">
							{labels.map((label) => (
								<LabelBadge
									key={label.id}
									name={label.name}
									color={label.color}
								/>
							))}
						</div>
					)}
				</div>
			</CardPanel>
		</Card>
	);
}
