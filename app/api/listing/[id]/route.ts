import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import type { Property } from "@/components/cards/PropertyCard";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const listing = await prisma.listing.findUnique({
      where: {
        id: params.id,
      },
      include: {
        location: true,
        images: { select: { url: true } },
        amenities: { select: { name: true } },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user has favorited this listing
    let isFavourited = false;
    if (userId) {
      const favourite = await prisma.userFavourite.findUnique({
        where: {
          userId_listingId: {
            userId,
            listingId: params.id,
          },
        },
      });
      isFavourited = !!favourite;
    }

    const property: Property = {
      id: listing.id,
      title: listing.title,
      description: listing.description ?? undefined,
      area: listing.area ?? 0,
      beds: listing.beds,
      baths: listing.baths,
      price: `$${(listing.rentalPrice ?? 0).toLocaleString("en-US")}`,
      images: listing.images.map((i) => i.url),
      featured: listing.featured ?? false,
      district: listing.location?.district ?? undefined,
      city: listing.location?.city ?? "",
      country: listing.location?.country ?? "",
      amenities: listing.amenities.map((a) => a.name),
      isFavourited,
    };

    return NextResponse.json(property);
  } catch (err) {
    console.error("Error fetching listing:", err);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
