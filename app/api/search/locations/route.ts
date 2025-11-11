import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all unique locations from listings
    const locations = await prisma.location.findMany({
      where: {
        listings: {
          some: {} // Only include locations that have at least one listing
        }
      },
      select: {
        city: true,
        country: true,
      },
      distinct: ['city', 'country'],
    });

    return NextResponse.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
