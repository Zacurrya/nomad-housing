import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import type { Property } from "@/components/cards/PropertyCard";

const prisma = new PrismaClient();

// GET: Fetch all favourites for a user
export async function GET(request: Request) {
  try {
    // TODO: Get userId from session/JWT once auth is implemented
    // For now, we'll return empty array if no userId header is provided
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json([]);
    }

    const favourites = await prisma.userFavourite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            location: true,
            images: { select: { url: true } },
            amenities: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const props: Property[] = favourites.map((fav) => {
      const l = fav.listing;
      return {
        id: l.id,
        title: l.title,
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
      };
    });

    return NextResponse.json(props);
  } catch (err) {
    console.error("Error fetching favourites:", err);
    return NextResponse.json({ error: "Failed to fetch favourites" }, { status: 500 });
  }
}

// POST: Add a favourite
export async function POST(req: NextRequest) {
  try {
    const { userId, listingId } = await req.json();

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: "userId and listingId are required" },
        { status: 400 }
      );
    }

    // Create the favourite (Prisma will handle duplicate constraint via @@unique)
    const favourite = await prisma.userFavourite.create({
      data: {
        userId,
        listingId,
      },
    });

    return NextResponse.json({ success: true, favourite }, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Already favourited" },
        { status: 409 }
      );
    }
    console.error("Error adding favourite:", error);
    return NextResponse.json(
      { error: "Failed to add favourite" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a favourite
export async function DELETE(req: NextRequest) {
  try {
    const { userId, listingId } = await req.json();

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: "userId and listingId are required" },
        { status: 400 }
      );
    }

    // Delete the favourite
    await prisma.userFavourite.deleteMany({
      where: {
        userId,
        listingId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing favourite:", error);
    return NextResponse.json(
      { error: "Failed to remove favourite" },
      { status: 500 }
    );
  }
}
