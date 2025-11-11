"use client";
import Link from "next/link";
import { useAuthUI } from "../context/AuthUIContext";

export default function AddListingButton() {
	const { isAuthenticated, openLogin } = useAuthUI();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!isAuthenticated) {
			e.preventDefault();
			openLogin("upload");
		}
	};

	return (
		<Link
			href="/uploadListing"
			onClick={handleClick}
			className="inline-flex items-center gap-2 h-9 px-3 rounded-md hover:bg-white/10"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				className="size-5"
			>
				<path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
			</svg>
			<span className="font-medium">Add Listing</span>
		</Link>
	);
}
