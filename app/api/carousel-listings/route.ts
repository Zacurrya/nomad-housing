import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let listings;

    switch (category) {
      case 'digital-nomad-hubs':
        // Cities popular with digital nomads
        listings = await prisma.listing.findMany({
          where: {
            location: {
              city: {
                in: ['Chiang Mai', 'Medellín', 'Lisbon', 'Bangkok', 'Austin', 'Barcelona', 'Berlin', 'Bali'],
              },
            },
          },
          include: {
            location: true,
            images: { select: { url: true }, take: 1 },
            _count: {
              select: {
                favouritedBy: true,
              },
            },
          },
          take: 20,
        });
        break;

      case 'coastal-escapes':
        // Cities with beaches
        listings = await prisma.listing.findMany({
          where: {
            location: {
              city: {
                in: ['Miami', 'Barcelona', 'Lisbon', 'Dubai', 'Tulum', 'Koh Samui', 'Porto', 'Nice', 'Sydney'],
              },
            },
          },
          include: {
            location: true,
            images: { select: { url: true }, take: 1 },
            _count: {
              select: {
                favouritedBy: true,
              },
            },
          },
          take: 20,
        });
        break;

      case 'old-world-charm':
        // Historic European/Asian cities
        listings = await prisma.listing.findMany({
          where: {
            location: {
              city: {
                in: ['Prague', 'Budapest', 'Porto', 'Tallinn', 'Krakow', 'Athens', 'Rome', 'Vienna', 'Paris'],
              },
            },
          },
          include: {
            location: true,
            images: { select: { url: true }, take: 1 },
            _count: {
              select: {
                favouritedBy: true,
              },
            },
          },
          take: 20,
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const transformedListings = listings.map((l) => ({
      id: l.id,
      title: l.title,
      city: l.location?.city ?? "",
      country: l.location?.country ?? "",
      district: l.location?.district ?? undefined,
      price: `$${(l.rentalPrice ?? 0).toLocaleString("en-US")}`,
      image: l.images[0]?.url ?? '/placeholder.png',
      beds: l.beds,
      baths: l.baths,
      area: l.area ?? 0,
      favouriteCount: l._count.favouritedBy,
    }));

    return NextResponse.json(transformedListings);
  } catch (error) {
    console.error('Error fetching carousel listings:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
