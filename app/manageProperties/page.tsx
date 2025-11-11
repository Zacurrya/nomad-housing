"use client";
import { useState, useEffect } from "react";
import { useAuthUI } from "@/components/context/AuthUIContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyListingCard, { MyListing } from "./MyListingCard";

export default function ManagePropertiesPage() {
	const { userId, isAuthenticated, openLogin, isLoading: authLoading } = useAuthUI();
	const router = useRouter();
	const [listings, setListings] = useState<MyListing[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		// Wait for auth to finish loading before checking authentication
		if (authLoading) {
			return;
		}

		if (!isAuthenticated) {
			openLogin();
			return;
		}

		if (userId) {
			fetchListings();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, isAuthenticated, authLoading]);

	const fetchListings = async () => {
		try {
			const response = await fetch(`/api/user-listings?userId=${userId}`);
			const data = await response.json();
			
			if (response.ok) {
				setListings(data.listings);
			} else {
				console.error("Error fetching listings:", data.error);
			}
		} catch (error) {
			console.error("Error fetching listings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (listingId: string) => {
		setDeletingId(listingId);
		try {
			const response = await fetch(
				`/api/user-listings?listingId=${listingId}&userId=${userId}`,
				{ method: "DELETE" }
			);

			if (response.ok) {
				setListings(listings.filter((listing) => listing.id !== listingId));
			} else {
				const data = await response.json();
				console.error(`Error: ${data.error}`);
			}
		} catch (error) {
			console.error("Error deleting listing:", error);
		} finally {
			setDeletingId(null);
		}
	};

	const handleEdit = (listingId: string) => {
		router.push(`/editListing/${listingId}`);
	};

	// Show loading screen while authentication is being checked
	if (authLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-semibold text-gray-900 mb-2">
							My Properties
						</h1>
						<p className="text-gray-600">
							Manage your uploaded property listings
						</p>
					</div>
					<Link
						href="/uploadListing"
						className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
					>
						+ Add New Property
					</Link>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex justify-center items-center py-20">
						<div className="text-gray-500">Loading your properties...</div>
					</div>
				)}

				{/* Empty State */}
				{!isLoading && listings.length === 0 && (
					<div className="bg-white rounded-lg p-12 text-center shadow-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-16 h-16 text-gray-400 mx-auto mb-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
							/>
						</svg>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							No properties yet
						</h2>
						<p className="text-gray-600 mb-6">
							Start listing your properties to reach potential tenants
						</p>
						<Link
							href="/uploadListing"
							className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
						>
							List Your First Property
						</Link>
					</div>
				)}

				{/* Listings Grid */}
				{!isLoading && listings.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{listings.map((listing) => (
							<MyListingCard
								key={listing.id}
								listing={listing}
								onEdit={handleEdit}
								onDelete={handleDelete}
								isDeleting={deletingId === listing.id}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
