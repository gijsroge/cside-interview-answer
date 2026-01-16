import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import type { repositorySearchCard_repository$key } from "@/utils/relay/__generated__/repositorySearchCard_repository.graphql";
import { graphql, useFragment } from "react-relay";
import TablerMessageCircle from "~icons/tabler/message-circle";
import TablerStar from "~icons/tabler/star";

const REPOSITORY_SEARCH_CARD_FRAGMENT = graphql`
	fragment repositorySearchCard_repository on Repository {
		name
		description
		stargazerCount
		owner {
			login
		}
		issues(states: [OPEN]) {
			totalCount
		}
	}
`;

interface RepositorySearchCardProps {
	repository: repositorySearchCard_repository$key;
}

export function RepositorySearchCard({
	repository,
}: RepositorySearchCardProps) {
	const data = useFragment(REPOSITORY_SEARCH_CARD_FRAGMENT, repository);

	const owner = data.owner?.login ?? "";

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle>
					{owner}/{data.name}
				</CardTitle>
				{data.description && (
					<CardDescription>{data.description}</CardDescription>
				)}
			</CardHeader>
			<CardPanel>
				<div className="flex items-center gap-4">
					{data.stargazerCount != null && (
						<Badge variant="outline">
							<TablerStar className="size-4" />{" "}
							{data.stargazerCount.toLocaleString()} stars
						</Badge>
					)}
					{data.issues?.totalCount != null && (
						<Badge variant="outline">
							<TablerMessageCircle className="size-4" />{" "}
							{data.issues.totalCount.toLocaleString()}{" "}
							{data.issues.totalCount === 1 ? "issue" : "issues"}
						</Badge>
					)}
				</div>
			</CardPanel>
		</Card>
	);
}
