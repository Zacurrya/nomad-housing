import { NextResponse } from "next/server";
import { getTrendingLocations } from "@/lib/db/queries";

// Force dynamic rendering as we depend on request.url
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || undefined;

    // Simple static mapping of carousel categories -> city lists. If you
    // later add category metadata to the DB you can replace this with a DB
    // filter instead of a static map.
    const categoryMap: Record<string, string[]> = {
      'digital-nomad-hubs': ['Bangkok', 'Lisbon', 'Chiang Mai', 'Medellin', 'Tallinn'],
      'coastal-escapes': ['Barcelona', 'Nice', 'Sydney', 'Miami', 'Bali', 'Lisbon'],
      'old-world-charm': ['Prague', 'Florence', 'Rome', 'Paris', 'Vienna', 'Istanbul'],
      'future-forward': ['San Francisco', 'Seoul', 'Tokyo', 'Singapore', 'Berlin', 'Shenzhen'],
    };

    // Fetch a larger set and then filter by category so we can select the
    // top favourites within that group.
    const trending = await getTrendingLocations(100);

    type TrendingItem = {
      city: string;
      country: string;
      imageUrl?: string;
      priceFrom?: number;
      listings: number;
      hearts?: number;
    };

    let filtered = trending as Array<TrendingItem>;
    if (category && categoryMap[category]) {
      const allowed = new Set(categoryMap[category].map((c) => c.toLowerCase()));
      filtered = filtered.filter((t) => allowed.has(String(t.city).toLowerCase()));
    }

    // If the category produced no matches fall back to the unfiltered list.
    if (category && filtered.length === 0) {
      filtered = trending as Array<TrendingItem>;
    }

    const mapped = filtered.slice(0, 12).map((t) => ({
      city: t.city,
      country: t.country,
      image: t.imageUrl ?? '/placeholder.png',
      priceFrom: `$${Math.round(t.priceFrom ?? 0)}`,
      listings: t.listings,
      totalFavourites: t.hearts ?? 0,
      category: category ?? null,
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error('Error fetching carousel locations', err);
    return NextResponse.json({ error: 'Failed to fetch carousel locations' }, { status: 500 });
  }
}
