"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
	listingId: string;
	onDelete: (listingId: string) => Promise<void>;
	isDeleting: boolean;
}

export default function DeleteButton({ listingId, onDelete, isDeleting }: DeleteButtonProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	const handleConfirmDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();
		await onDelete(listingId);
		setShowConfirm(false);
	};

	const handleShowConfirm = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowConfirm(true);
	};

	const handleCancel = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowConfirm(false);
	};

	return (
		<div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
			{showConfirm ? (
				<div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-3">
					<p className="text-sm font-medium text-gray-900 whitespace-nowrap">
						Delete this listing?
					</p>
					<div className="flex gap-2">
						<button
							onClick={handleConfirmDelete}
							disabled={isDeleting}
							className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</button>
						<button
							onClick={handleCancel}
							className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={handleShowConfirm}
					className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all shadow-lg"
					title="Delete listing"
				>
					<Trash2 className="w-5 h-5" />
				</button>
			)}
		</div>
	);
}
