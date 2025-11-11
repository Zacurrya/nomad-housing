import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// Enable caching for this route - locations change infrequently
export const revalidate = 300; // Revalidate every 5 minutes

// Static location images mapping
const locationImages: Record<string, string> = {
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBza3lsaW5lfGVufDF8fHx8MTc2MjY2NzQ0OXww&ixlib=rb-4.1.0&q=80&w=1080',
  'Bangkok': 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwxfHx8fDE3NjI2ODg4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Saigon': 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
  'Tokyo': 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200&auto=format&fit=crop',
  'Medellín': 'https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhfGVufDF8fHx8MTc2MjY4ODg1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'Lisbon': 'https://images.unsplash.com/photo-1536663815808-535e2280d2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXNib24lMjBwb3J0dWdhbHxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Barcelona': 'https://images.unsplash.com/photo-1593368858664-a7fe556ab936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzcGFpbnxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Melbourne': 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Buenos Aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Singapore': 'https://images.unsplash.com/photo-1702893165989-8ec6c7ddfba7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632',
  'Osaka': 'https://images.unsplash.com/photo-1731338634914-a22509394cf2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1472',
  'Chiang Mai': 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Shenzhen': 'https://images.unsplash.com/photo-1659079992080-be171a869271?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
  'Paris': 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
  'Cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Budapest': 'https://images.unsplash.com/photo-1578005077431-ae6d90ba4c48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  'Tallinn': 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?q=80&w=1200&auto=format&fit=crop',
  'Krakow': 'https://images.unsplash.com/photo-1613969498763-86b647bc7527?q=80&w=1200&auto=format&fit=crop',
  'Austin': 'https://images.unsplash.com/photo-1603007588138-971e6d56e223?q=80&w=1200&auto=format&fit=crop',
  'Nice': 'https://images.unsplash.com/photo-1570633231339-5e99ce07b8eb?q=80&w=1200&auto=format&fit=crop',
  'Tehran': 'https://images.unsplash.com/photo-1564150736927-1e6f48e1b89d?q=80&w=1200&auto=format&fit=crop',
  'Edinburgh': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Porto': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
};

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
      const image = locationImages[city] || '/placeholder.png';

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
