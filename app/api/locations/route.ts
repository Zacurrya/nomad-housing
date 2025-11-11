import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// Enable caching for this route - locations change infrequently
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        listings: {
          include: {
            images: true,
            _count: {
              select: {
                favouritedBy: true,
              },
            },
          },
        },
      },
    });

    // Fetch all city data
    const cities = await prisma.city.findMany();
    const cityImageMap = new Map(
      cities.map((city) => [city.name, city.imageUrl])
    );

    // Group locations by city to combine duplicate cities
    const cityMap = new Map<string, {
      country: string;
      listings: typeof locations[0]['listings'];
      prices: number[];
      totalFavourites: number;
    }>();

    locations.forEach((location) => {
      const existingCity = cityMap.get(location.city);
      
      if (existingCity) {
        // Add listings to existing city
        existingCity.listings.push(...location.listings);
        const newPrices = location.listings
          .filter((l) => l.rentalPrice !== null)
          .map((l) => l.rentalPrice as number);
        existingCity.prices.push(...newPrices);
        // Add up the favourites
        const newFavourites = location.listings.reduce((sum, l) => sum + l._count.favouritedBy, 0);
        existingCity.totalFavourites += newFavourites;
      } else {
        // Create new city entry
        const prices = location.listings
          .filter((l) => l.rentalPrice !== null)
          .map((l) => l.rentalPrice as number);
        const totalFavourites = location.listings.reduce((sum, l) => sum + l._count.favouritedBy, 0);
        cityMap.set(location.city, {
          country: location.country,
          listings: [...location.listings],
          prices,
          totalFavourites,
        });
      }
    });

    // Transform the grouped data to match the expected format
    const transformedLocations = Array.from(cityMap.entries()).map(([city, data]) => {
      const minPrice = data.prices.length > 0 ? Math.min(...data.prices) / 100 : 0;
      const image = cityImageMap.get(city) || '/placeholder.png';

      return {
        city,
        country: data.country,
        image,
        priceFrom: `$${Math.round(minPrice).toLocaleString()}`,
        listings: data.listings.length,
        totalFavourites: data.totalFavourites,
      };
    });

    // Sort by total favourites descending and take top 6
    const topLocations = transformedLocations
      .sort((a, b) => b.totalFavourites - a.totalFavourites)
      .slice(0, 6);

    return NextResponse.json(topLocations, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
