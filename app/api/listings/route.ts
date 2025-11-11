import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import type { Property } from "@/components/cards/PropertyCard";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const userId = searchParams.get('userId');

    const listings = await prisma.listing.findMany({
      where: city ? {
        location: {
          city: {
            equals: city,
            mode: 'insensitive'
          }
        }
      } : undefined,
      include: {
        location: true,
        images: { select: { url: true } },
        amenities: { select: { name: true } },
      },
    });

    // Get all favorited listings for this user (if authenticated)
    let favouritedListingIds = new Set<string>();
    if (userId) {
      const favourites = await prisma.userFavourite.findMany({
        where: { userId },
        select: { listingId: true },
      });
      favouritedListingIds = new Set(favourites.map(f => f.listingId));
    }

    const props: Property[] = listings.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description ?? undefined,
      area: l.area ?? 0,
      beds: l.beds,
      baths: l.baths,
      price: `$${(l.rentalPrice ?? 0).toLocaleString("en-US")}`,
      images: l.images.map((i) => i.url),
      featured: l.featured ?? false,
      district: l.location?.district ?? undefined,
      city: l.location?.city ?? "",
      country: l.location?.country ?? "",
      amenities: l.amenities.map((a) => a.name),
      isFavourited: favouritedListingIds.has(l.id),
    }));

    return NextResponse.json(props);
  } catch (err) {
    console.error("Error fetching listings:", err);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}
