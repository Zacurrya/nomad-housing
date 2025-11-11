import Link from "next/link";

export default function ExploreButton() {
	return (
		<Link 
			href="/search"
			className="inline-flex items-center gap-2 h-9 px-3 rounded-md hover:bg-white/10"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
				<path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8Z" clipRule="evenodd" />
			</svg>
			<span className="font-medium">Explore</span>
		</Link>
	);
}
