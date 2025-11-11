import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}

		// Fetch user's listings
		const listings = await prisma.listing.findMany({
			where: {
				userId: userId,
			},
			include: {
				location: true,
				images: {
					take: 1,
					orderBy: {
						id: "asc",
					},
				},
				_count: {
					select: {
						favouritedBy: true,
					},
				},
			},
			orderBy: {
				id: "desc",
			},
		});

		return NextResponse.json({ listings });
	} catch (error) {
		console.error("Error fetching user listings:", error);
		return NextResponse.json(
			{ error: "Failed to fetch listings" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const listingId = searchParams.get("listingId");
		const userId = searchParams.get("userId");

		if (!listingId || !userId) {
			return NextResponse.json(
				{ error: "Listing ID and User ID are required" },
				{ status: 400 }
			);
		}

		// Verify the listing belongs to the user
		const listing = await prisma.listing.findFirst({
			where: {
				id: listingId,
				userId: userId,
			},
		});

		if (!listing) {
			return NextResponse.json(
				{ error: "Listing not found or you don't have permission to delete it" },
				{ status: 404 }
			);
		}

		// Delete the listing (cascading deletes will handle images and amenity relations)
		await prisma.listing.delete({
			where: {
				id: listingId,
			},
		});

		return NextResponse.json({ success: true, message: "Listing deleted successfully" });
	} catch (error) {
		console.error("Error deleting listing:", error);
		return NextResponse.json(
			{ error: "Failed to delete listing" },
			{ status: 500 }
		);
	}
}
