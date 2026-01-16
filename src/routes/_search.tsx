import { Field } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { SearchIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { z } from "zod";

const searchSchema = z.object({
	query: z.string().optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});

export const Route = createFileRoute("/_search")({
	component: SearchLayout,
	validateSearch: zodValidator(searchSchema),
});

function SearchLayout() {
	const [query, setQuery] = useQueryState(
		"query",
		parseAsString.withDefault("").withOptions({ history: "replace" }),
	);
	const [, setAfter] = useQueryState(
		"after",
		parseAsString.withOptions({ history: "replace" }),
	);
	const [, setBefore] = useQueryState(
		"before",
		parseAsString.withOptions({ history: "replace" }),
	);
	const [, setPage] = useQueryState(
		"page",
		parseAsInteger.withOptions({ history: "replace" }),
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value ?? undefined;
		setQuery(newQuery);
		// Clear pagination params when query changes
		if (newQuery !== query) {
			setAfter(null);
			setBefore(null);
			setPage(null);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<div className="grid gap-4 container mx-auto p-4 md:p-6 pb-14 max-w-4xl">
			<form onSubmit={handleSubmit} className="flex gap-2">
				<Field className="w-full">
					<InputGroup>
						<InputGroupAddon>
							<SearchIcon className="w-4 h-4" />
						</InputGroupAddon>
						<InputGroupInput
							size="lg"
							type="search"
							placeholder="Search repositories..."
							value={query || ""}
							onChange={handleInputChange}
							className="flex-1"
							name="query"
						/>
					</InputGroup>
				</Field>
			</form>

			<Outlet />
		</div>
	);
}
