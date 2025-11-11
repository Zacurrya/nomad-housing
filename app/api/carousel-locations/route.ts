import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// Enable caching for this route - carousel data changes infrequently
export const revalidate = 300; // Revalidate every 5 minutes

// Static location images mapping
const locationImages: Record<string, string> = {
    // Europe
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBza3lsaW5lfGVufDF8fHx8MTc2MjY2NzQ0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    'Lisbon': 'https://images.unsplash.com/photo-1536663815808-535e2280d2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXNib24lMjBwb3J0dWdhbHxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Barcelona': 'https://images.unsplash.com/photo-1593368858664-a7fe556ab936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzcGFpbnxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Paris': 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    'Porto': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Nice': 'https://images.unsplash.com/photo-1570633231339-5e99ce07b8eb?q=80&w=1200&auto=format&fit=crop',
    'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Budapest': 'https://images.unsplash.com/photo-1578005077431-ae6d90ba4c48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'Tallinn': 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?q=80&w=1200&auto=format&fit=crop',
    'Krakow': 'https://images.unsplash.com/photo-1613969498763-86b647bc7527?q=80&w=1200&auto=format&fit=crop',
    'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Edinburgh': 'https://images.unsplash.com/photo-1720375061021-11217da5499d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    // Asia
    'Bangkok': 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwxfHx8fDE3NjI2ODg4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Saigon': 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    'Tokyo': 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200&auto=format&fit=crop',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Singapore': 'https://images.unsplash.com/photo-1702893165989-8ec6c7ddfba7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632',
    'Osaka': 'https://images.unsplash.com/photo-1731338634914-a22509394cf2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1472',
    'Chiang Mai': 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Shenzhen': 'https://images.unsplash.com/photo-1659079992080-be171a869271?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    'Seoul': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470',
    'Shanghai': 'https://images.unsplash.com/photo-1537266484881-de6a40fba897?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470',
    'Koh Samui': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Tehran': 'https://images.unsplash.com/photo-1564150736927-1e6f48e1b89d?q=80&w=1200&auto=format&fit=crop',
    'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',

    // North America
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Chicago': 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
    'Miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Austin': 'https://images.unsplash.com/photo-1603007588138-971e6d56e223?q=80&w=1200&auto=format&fit=crop',
    'Tulum': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',

    // South America
    'Buenos Aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Sao Paulo': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
    'Rio de Janeiro': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
    'Medellín': 'https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhfGVufDF8fHx8MTc2MjY4ODg1Nnww&ixlib=rb-4.1.0&q=80&w=1080',

    // Oceania
    'Melbourne': 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',

    // Africa
    'Cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Cape Town': 'https://images.unsplash.com/photo-1505765052242-0a3fa2b8f1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
};

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

        return [
          location.city,
          {
            city: location.city,
            country: location.country,
            image: locationImages[location.city] || '/placeholder.png',
            priceFrom: `$${lowestPrice.toLocaleString("en-US")}`,
            listings: location.listings.length,
            totalFavourites,
          }
        ];
      })
    );

    // Country mapping for cities not yet in database
    const countryMap: Record<string, string> = {
      'Chiang Mai': 'Thailand',
      'Medellín': 'Colombia',
      'Lisbon': 'Portugal',
      'Bangkok': 'Thailand',
      'Austin': 'United States',
      'Barcelona': 'Spain',
      'Berlin': 'Germany',
      'Bali': 'Indonesia',
      'Miami': 'United States',
      'Dubai': 'United Arab Emirates',
      'Tulum': 'Mexico',
      'Koh Samui': 'Thailand',
      'Porto': 'Portugal',
      'Nice': 'France',
      'Sydney': 'Australia',
      'Prague': 'Czech Republic',
      'Budapest': 'Hungary',
      'Tallinn': 'Estonia',
      'Krakow': 'Poland',
      'Athens': 'Greece',
      'Rome': 'Italy',
      'Vienna': 'Austria',
      'Paris': 'France',
      'Cape Town': 'South Africa',
      'Chicago': 'United States',
      'Sao Paulo': 'Brazil',
      'Rio de Janeiro': 'Brazil',
      'Cairo': 'Egypt',
      'Tehran': 'Iran',
      'Edinburgh': 'Scotland',
      'Kyoto': 'Japan',
      'Tokyo': 'Japan',
      'Singapore': 'Singapore',
      'Shenzhen': 'China',
      'Seoul': 'South Korea',
      'Shanghai': 'China',
    };

    // Build ordered list, including cities not yet in database
    const orderedLocations = cityList.map(city => {
      const existing = locationMap.get(city);
      if (existing) {
        return existing;
      }
      // Return placeholder data for cities not in database
      return {
        city,
        country: countryMap[city] || 'Unknown',
        image: locationImages[city] || '/placeholder.png',
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
