import { LuLoaderCircle } from "react-icons/lu";

export default function Loader({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) {
	return (
		<div className={`animate-spin ${className}`}>
			<LuLoaderCircle size={size || 24} />
		</div>
	);
}
