import { ContributorsList } from "@/components/repository/contributors-list";
import { RepositoryStats } from "@/components/repository/repository-stats";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { repositoryHeader_repository$key } from "@/utils/relay/__generated__/repositoryHeader_repository.graphql";
import { graphql, useFragment } from "react-relay";

const REPOSITORY_HEADER_FRAGMENT = graphql`
	fragment repositoryHeader_repository on Repository {
		name
		description
		url
		owner {
			login
			avatarUrl
		}
		...repositoryStats_repository
		...contributorsList_repository
	}
`;

interface RepositoryHeaderProps {
	repository: repositoryHeader_repository$key;
}

export function RepositoryHeader({ repository }: RepositoryHeaderProps) {
	const data = useFragment(REPOSITORY_HEADER_FRAGMENT, repository);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-3 mb-2">
					{data.owner?.avatarUrl && (
						<img
							src={data.owner.avatarUrl}
							alt={data.owner.login || ""}
							className="w-10 h-10 rounded-full"
						/>
					)}
					<CardTitle className="text-2xl">
						<a
							href={data.url}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							{data.owner?.login}/{data.name}
						</a>
					</CardTitle>
				</div>
				{data.description && (
					<CardDescription className="text-base mb-4">
						{data.description}
					</CardDescription>
				)}
				<RepositoryStats repository={data} />
				<ContributorsList className="mt-4" repository={data} />
			</CardHeader>
		</Card>
	);
}
