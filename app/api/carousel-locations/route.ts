import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// Enable caching for this route - carousel data changes infrequently
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let cityList: string[];

    switch (category) {
        case 'digital-nomad-hubs':
            cityList = ['Chiang Mai', 'Medellín', 'Lisbon', 'Bangkok', 'Austin', 'Barcelona', 'Berlin', 'Bali'];
            break;

        case 'coastal-escapes':
            cityList = ['Miami', 'Barcelona', 'Lisbon', 'Dubai', 'Tulum', 'Koh Samui', 'Porto', 'Nice', 'Sydney'];
            break;

        case 'city-life':
            cityList = ['Chicago', 'Cape Town', 'Cairo', 'Sao Paulo', 'Rio de Janeiro'];
            break;

        case 'old-world-charm':
            cityList = ['Prague', 'Cairo', 'Budapest', 'Porto', 'Tallinn', 'Krakow', 'Athens', 'Rome', 'Vienna', 'Paris', 'Tehran', 'Edinburgh', 'Kyoto'];
            break;

        case 'future-forward':
            cityList = ['Tokyo', 'Singapore', 'Dubai', 'Shenzhen', 'Seoul', 'Shanghai'];
            break;
        default:
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Fetch city data from the cities table
    const cities = await prisma.city.findMany({
      where: {
        name: {
          in: cityList,
        },
      },
    });

    // Create a map of city data
    const cityMap = new Map(
      cities.map((city) => [city.name, city])
    );

    // Fetch locations with their listings
    const locations = await prisma.location.findMany({
      where: {
        city: {
          in: cityList,
        },
      },
      include: {
        listings: {
          include: {
            _count: {
              select: {
                favouritedBy: true,
              },
            },
          },
        },
      },
    });

    // Create a map of existing locations
    const locationMap = new Map(
      locations.map((location) => {
        const validListings = location.listings.filter(l => l.rentalPrice != null);
        const lowestPrice = validListings.length > 0
          ? Math.min(...validListings.map((l) => l.rentalPrice!))
          : 0;
        
        const totalFavourites = location.listings.reduce(
          (sum, l) => sum + l._count.favouritedBy,
          0
        );

        const cityData = cityMap.get(location.city);

        return [
          location.city,
          {
            city: location.city,
            country: location.country,
            image: cityData?.imageUrl || '/placeholder.png',
            priceFrom: `$${lowestPrice.toLocaleString("en-US")}`,
            listings: location.listings.length,
            totalFavourites,
          }
        ];
      })
    );

    // Build ordered list, using city data from database
    const orderedLocations = cityList.map(cityName => {
      const existing = locationMap.get(cityName);
      if (existing) {
        return existing;
      }
      
      // Get city data from database for cities without listings
      const cityData = cityMap.get(cityName);
      return {
        city: cityName,
        country: cityData?.country || 'Unknown',
        image: cityData?.imageUrl || '/placeholder.png',
        priceFrom: '$0',
        listings: 0,
        totalFavourites: 0,
      };
    });

    return NextResponse.json(orderedLocations, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching carousel locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel locations" },
      { status: 500 }
    );
  }
}
