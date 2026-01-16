import { IssueDetailContent } from "@/components/issues/issue-detail-content";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import type { repositoryNumberQuery } from "@/utils/relay/__generated__/repositoryNumberQuery.graphql";
import {
	createFileRoute,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { fetchQuery, graphql } from "react-relay";

const ISSUE_DETAIL_QUERY = graphql`
	query repositoryNumberQuery(
		$owner: String!
		$name: String!
		$number: Int!
	) {
		repository(owner: $owner, name: $name) {
			issue(number: $number) {
				id
				number
				title
				createdAt
				state
				...issueDetailContent_issue
			}
		}
	}
`;

export const Route = createFileRoute("/repository/$owner/$name/$number")({
	component: IssueDetail,
	loader: async ({ context: { relayEnvironment }, params }) => {
		const data = await fetchQuery<repositoryNumberQuery>(
			relayEnvironment,
			ISSUE_DETAIL_QUERY,
			{
				owner: params.owner,
				name: params.name,
				number: parseInt(params.number, 10),
			},
			{ fetchPolicy: "store-or-network" },
		).toPromise();

		if (!data) {
			throw new Error("Failed to fetch issue details");
		}

		return data;
	},
});

function IssueDetail() {
	const data = Route.useLoaderData();
	const { owner, name } = Route.useParams();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const issue = data.repository?.issue;

	const handleDialogClose = () => {
		navigate({
			to: "/repository/$owner/$name",
			params: { owner, name },
			search: routerState.location.search,
			resetScroll: false,
		});
	};

	if (!issue) {
		return (
			<Dialog open={true} onOpenChange={(open) => !open && handleDialogClose()}>
				<DialogPopup>
					<DialogPanel>
						<div className="text-center text-muted-foreground py-8">
							Issue not found.
						</div>
					</DialogPanel>
				</DialogPopup>
			</Dialog>
		);
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && handleDialogClose()}>
			<DialogPopup className="max-w-4xl max-h-[90vh] pb-6">
				<DialogHeader className="pr-[5ch]">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<DialogTitle className="text-2xl">
								#{issue.number} {issue.title}
							</DialogTitle>
							<div className="flex items-center gap-2 flex-wrap mt-2">
								<Badge
									className="lowercase"
									variant={issue.state === "OPEN" ? "success" : "secondary"}
								>
									{issue.state}
								</Badge>
								{issue.createdAt && (
									<p className="text-sm text-muted-foreground">
										Created{" "}
										{new Intl.DateTimeFormat("en-US").format(
											new Date(issue.createdAt),
										)}
									</p>
								)}
							</div>
						</div>
					</div>
				</DialogHeader>
				<DialogPanel className="max-h-[90vh] flex flex-col gap-2">
					<IssueDetailContent issue={issue} />
					<Outlet />
				</DialogPanel>
			</DialogPopup>
		</Dialog>
	);
}
