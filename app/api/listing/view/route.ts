import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const { listingId } = await request.json();

		if (!listingId) {
			return NextResponse.json(
				{ error: "Listing ID is required" },
				{ status: 400 }
			);
		}

		// Increment the view count for the listing
		await prisma.listing.update({
			where: { id: listingId },
			data: {
				viewCount: {
					increment: 1,
				},
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error tracking listing view:", error);
		return NextResponse.json(
			{ error: "Failed to track view" },
			{ status: 500 }
		);
	}
}
