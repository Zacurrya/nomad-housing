import { NextResponse } from "next/server";
import type { Property } from "@/components/cards/PropertyCard";
import { getListings } from "@/lib/db/queries";
import { parseUSD } from "@/lib/currency";

// Force dynamic rendering as we depend on request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Accept both `city` (single-value repeated) and `cities` (array) query keys
    const cities = [...searchParams.getAll('city'), ...searchParams.getAll('cities')].filter(Boolean);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    // Accept either `minBeds` (legacy) or `bedrooms` (new) query param
    const minBeds = searchParams.get('minBeds') ?? searchParams.get('bedrooms');
    const amenities = searchParams.getAll('amenities');
    const userId = searchParams.get('userId');

    const listings = await getListings({
      cities: cities.length ? cities : [],
      bedrooms: minBeds ? parseInt(minBeds, 10) : undefined,
      limit: 1000,
      userId: userId ?? undefined,
    });

    // Post-filter by price and amenities (getListings currently doesn't support price/amenity filtering)
    let results: Property[] = listings;
    if (minPrice) {
      const min = parseFloat(minPrice);
      results = results.filter((p) => parseUSD(p.price) >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      results = results.filter((p) => parseUSD(p.price) <= max);
    }
    if (amenities.length > 0) {
      results = results.filter((p) => {
        const set = new Set(p.amenities ?? []);
        return amenities.every((a) => set.has(a));
      });
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error("Error fetching listings:", err);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}
