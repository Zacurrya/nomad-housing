"use client";
import { Pencil } from "lucide-react";

interface EditButtonProps {
	listingId: string;
	onEdit: (listingId: string) => void;
}

export default function EditButton({ listingId, onEdit }: EditButtonProps) {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEdit(listingId);
	};

	return (
		<button
			onClick={handleClick}
			className="absolute top-3 right-3 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-blue-700 transition-all shadow-lg z-10"
			title="Edit listing"
		>
			<Pencil className="w-5 h-5" />
		</button>
	);
}
