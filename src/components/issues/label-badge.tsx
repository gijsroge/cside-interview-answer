import { Badge } from "@/components/ui/badge";

interface LabelBadgeProps {
	name: string;
	color: string;
}

export function LabelBadge({ name, color }: LabelBadgeProps) {
	return (
		<Badge
			className="lowercase flex items-center gap-1"
			variant="outline"
			style={{}}
		>
			<span
				className="size-2 rounded-full shrink-0"
				style={{
					backgroundColor: `#${color}`,
				}}
			/>
			{name}
		</Badge>
	);
}
