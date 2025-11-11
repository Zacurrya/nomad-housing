"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bed, Bath, Eye, Heart } from "lucide-react";
import DeleteButton from "./ui/DeleteButton";
import EditButton from "./ui/EditButton";

export interface MyListing {
	id: string;
	title: string;
	beds: number;
	baths: number;
	area: number;
	rentalPrice: number;
	viewCount: number;
	location: {
		city: string;
		district: string;
		country: string;
	};
	images: Array<{
		url: string;
	}>;
	_count: {
		favouritedBy: number;
	};
}

interface MyListingCardProps {
	listing: MyListing;
	onEdit: (listingId: string) => void;
	onDelete: (listingId: string) => Promise<void>;
	isDeleting: boolean;
}

export default function MyListingCard({
	listing,
	onEdit,
	onDelete,
	isDeleting,
}: MyListingCardProps) {
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/listing/${listing.id}`);
	};

	return (
		<div 
			onClick={handleCardClick}
			className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
		>
			{/* Property Image with Action Buttons */}
			<div className="relative h-48 bg-gray-200 group">
				{listing.images[0] ? (
					<Image
						src={listing.images[0].url}
						alt={listing.title}
						fill
						className="object-cover"
					/>
				) : (
					<div className="flex items-center justify-center h-full text-gray-400">
						No Image
					</div>
				)}

				{/* Delete Button - Top Left */}
				<DeleteButton
					listingId={listing.id}
					onDelete={onDelete}
					isDeleting={isDeleting}
				/>

				{/* Edit Button - Top Right */}
				<EditButton listingId={listing.id} onEdit={onEdit} />
			</div>

			{/* Property Details */}
			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
					{listing.title}
				</h3>
				<p className="text-sm text-gray-600 mb-3">
					{listing.location.district}, {listing.location.city},{" "}
					{listing.location.country}
				</p>

				<div className="flex items-center gap-4 text-xs text-gray-600">
					<span className="inline-flex items-center gap-1">
						<Bed className="w-4.5 h-4.5" />
						{listing.beds}
					</span>
					<span className="inline-flex items-center gap-1">
						<Bath className="w-4.5 h-4.5" />
						{listing.baths}
					</span>
					<span className="inline-flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-4.5 h-4.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
							/>
						</svg>
						{listing.area} m²
					</span>
				</div>

				{/* View Count and Favorite Count */}
				<div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
					<span className="inline-flex items-center gap-1" title="Total views">
						<Eye className="w-4 h-4" />
						{listing.viewCount}
					</span>
					<span className="inline-flex items-center gap-1" title="Favorited by">
						<Heart className="w-4 h-4" />
						{listing._count.favouritedBy}
					</span>
				</div>

				<div className="text-xl font-bold text-gray-900 mt-4">
					${listing.rentalPrice.toLocaleString()}
					<span className="text-sm font-normal text-gray-600">/month</span>
				</div>
			</div>
		</div>
	);
}
