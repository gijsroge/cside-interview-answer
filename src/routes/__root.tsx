import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { RelayEnvironmentProvider } from "react-relay";
import relayEnvironment from "../utils/relay/environment";

export const Route = createRootRouteWithContext<{
	relayEnvironment: typeof relayEnvironment;
}>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Search and explore GitHub repositories",
			},
		],
	}),
});

function RootComponent() {
	return (
		<RelayEnvironmentProvider environment={relayEnvironment}>
			<NuqsAdapter>
				<HeadContent />
				<Outlet />
			</NuqsAdapter>
		</RelayEnvironmentProvider>
	);
}
