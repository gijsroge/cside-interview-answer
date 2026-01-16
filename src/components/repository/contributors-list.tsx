import {
	Tooltip,
	TooltipPopup,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { contributorsList_repository$key } from "@/utils/relay/__generated__/contributorsList_repository.graphql";
import type { ComponentPropsWithRef } from "react";
import { graphql, useFragment } from "react-relay";

const CONTRIBUTORS_LIST_FRAGMENT = graphql`
	fragment contributorsList_repository on Repository {
		defaultBranchRef {
			target {
				... on Commit {
					history(first: 100) {
						edges {
							node {
								author {
									user {
										id
										login
										avatarUrl
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

interface ContributorsListProps extends ComponentPropsWithRef<"div"> {
	repository: contributorsList_repository$key;
}

export function ContributorsList({
	repository,
	className,
	...props
}: ContributorsListProps) {
	const data = useFragment(CONTRIBUTORS_LIST_FRAGMENT, repository);

	const commitHistory = data.defaultBranchRef?.target?.history;
	const contributorsMap = new Map<
		string,
		{ id: string; login: string | null; avatarUrl: string }
	>();

	if (commitHistory?.edges) {
		for (const edge of commitHistory.edges) {
			const user = edge?.node?.author?.user;
			if (user?.id && user?.avatarUrl) {
				if (!contributorsMap.has(user.id)) {
					contributorsMap.set(user.id, {
						id: user.id,
						login: user.login ?? null,
						avatarUrl: String(user.avatarUrl),
					});
				}
			}
		}
	}

	const contributors = Array.from(contributorsMap.values()).slice(0, 10);

	if (contributors.length <= 1) {
		return null;
	}

	return (
		<div className={cn("", className)} {...props}>
			<h2 className="font-semibold text-lg">Contributors</h2>
			<p className="mb-2 text-sm text-muted-foreground">
				Top contributors to this repository
			</p>

			<TooltipProvider>
				<div className="flex flex-wrap gap-2">
					{contributors.map((contributor) => (
						<Tooltip key={contributor.id}>
							<TooltipTrigger>
								<img
									src={contributor.avatarUrl}
									alt={contributor.login || ""}
									className="w-12 h-12 rounded-full"
								/>
							</TooltipTrigger>
							{contributor.login && (
								<TooltipPopup>{contributor.login}</TooltipPopup>
							)}
						</Tooltip>
					))}
				</div>
			</TooltipProvider>
		</div>
	);
}
