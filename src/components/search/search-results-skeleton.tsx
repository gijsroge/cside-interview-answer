import { Card, CardHeader, CardPanel } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultsSkeleton() {
	return (
		<>
			<div className="text-sm text-muted-foreground flex items-center gap-2 justify-between">
				<Skeleton className="h-5 w-20 inline-block" />
				<Skeleton className="h-5 w-20 inline-block" />
			</div>
			<div className="space-y-4">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-48 mb-2" />
							<Skeleton className="h-4 w-full" />
						</CardHeader>
						<CardPanel>
							<Skeleton className="h-6 w-24" />
						</CardPanel>
					</Card>
				))}
			</div>
		</>
	);
}
