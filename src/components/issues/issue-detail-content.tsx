import { Card, CardPanel } from "@/components/ui/card";
import type { issueDetailContent_issue$key } from "@/utils/relay/__generated__/issueDetailContent_issue.graphql";
import { graphql, useFragment } from "react-relay";
import { LabelBadge } from "./label-badge";

const ISSUE_DETAIL_CONTENT_FRAGMENT = graphql`
	fragment issueDetailContent_issue on Issue {
		bodyText
		labels(first: 10) {
			nodes {
				id
				name
				color
			}
		}
	}
`;

interface IssueDetailContentProps {
	issue: issueDetailContent_issue$key;
}

export function IssueDetailContent({ issue }: IssueDetailContentProps) {
	const data = useFragment(ISSUE_DETAIL_CONTENT_FRAGMENT, issue);

	const labels =
		data.labels?.nodes?.filter(
			(node): node is NonNullable<typeof node> =>
				node != null &&
				node.id != null &&
				node.name != null &&
				node.color != null,
		) ?? [];

	return (
		<Card>
			<CardPanel>
				{labels.length > 0 && (
					<div className="flex gap-2 flex-wrap mb-4">
						{labels.map((label) => (
							<LabelBadge
								key={label.id}
								name={label.name}
								color={label.color}
							/>
						))}
					</div>
				)}
				{data.bodyText && (
					<div className="whitespace-pre-wrap wrap-break-word text-sm">
						{data.bodyText}
					</div>
				)}
			</CardPanel>
		</Card>
	);
}
