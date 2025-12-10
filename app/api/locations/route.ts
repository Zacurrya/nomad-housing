import { NextResponse } from "next/server";
import { getCities, getListings } from "@/lib/db/queries";

export const revalidate = 3600;

export async function GET() {
  try {
    const cities = await getCities();

    // For each city, compute a simple payload used by the home page: city, country, image, priceFrom, listings
    const mapped = await Promise.all(
      cities.map(async (c) => {
        const listings = await getListings({ cities: [c.name], limit: 50 });
        const priceFrom = listings.length > 0 ? listings.reduce((min: number, p) => Math.min(min, parseFloat(p.price.replace(/[^0-9.]/g, ''))), Number.POSITIVE_INFINITY) : 0;
        return {
          city: c.name,
          country: c.country,
          image: c.imageUrl ?? '/placeholder.png',
          priceFrom: priceFrom ? String(Math.round(priceFrom)) : '0',
          listings: listings.length,
        };
      })
    );

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error('Error fetching locations', err);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
