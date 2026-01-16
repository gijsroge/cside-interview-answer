import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { repositoryStats_repository$key } from "@/utils/relay/__generated__/repositoryStats_repository.graphql";
import type { ComponentPropsWithRef } from "react";
import { graphql, useFragment } from "react-relay";

import TablerGitBranch from "~icons/tabler/git-branch";
import TablerGitCommit from "~icons/tabler/git-commit";
import TablerGitFork from "~icons/tabler/git-fork";
import TablerStar from "~icons/tabler/star";
import TablerUsers from "~icons/tabler/users";

const REPOSITORY_STATS_FRAGMENT = graphql`
	fragment repositoryStats_repository on Repository {
		stargazerCount
		forkCount
		refs(refPrefix: "refs/heads/", first: 0) {
			totalCount
		}
		defaultBranchRef {
			target {
				... on Commit {
					history(first: 100) {
						totalCount
					}
				}
			}
		}
	}
`;

interface RepositoryStatsProps extends ComponentPropsWithRef<"div"> {
	repository: repositoryStats_repository$key;
	contributorCount?: number | null;
}

export function RepositoryStats({
	repository,
	contributorCount,
	className,
	...props
}: RepositoryStatsProps) {
	const data = useFragment(REPOSITORY_STATS_FRAGMENT, repository);

	const branchCount = data.refs?.totalCount ?? 0;
	const commitCount = data.defaultBranchRef?.target?.history?.totalCount ?? 0;

	return (
		<div
			className={cn("flex items-center gap-4 flex-wrap", className)}
			{...props}
		>
			<Badge variant="outline">
				<TablerStar className="size-4" /> {data.stargazerCount.toLocaleString()}{" "}
				stars
			</Badge>
			<Badge variant="outline">
				<TablerGitFork className="size-4" /> {data.forkCount.toLocaleString()}{" "}
				forks
			</Badge>
			<Badge variant="outline">
				<TablerGitBranch className="size-4" /> {branchCount.toLocaleString()}{" "}
				branches
			</Badge>
			<Badge variant="outline">
				<TablerGitCommit className="size-4" /> {commitCount.toLocaleString()}{" "}
				commits
			</Badge>
			{contributorCount != null && (
				<Badge variant="outline">
					<TablerUsers className="size-4" /> {contributorCount.toLocaleString()}{" "}
					contributors
				</Badge>
			)}
		</div>
	);
}
