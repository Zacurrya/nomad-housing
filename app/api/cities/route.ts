import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// Enable caching for this route - cities change infrequently
export const revalidate = 300; // Revalidate every 5 minutes

// GET /api/cities - Fetch all cities
export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(cities, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

// POST /api/cities - Create a new city
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, country, imageUrl } = body;

    if (!name || !country || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, country, imageUrl' },
        { status: 400 }
      );
    }

    const city = await prisma.city.create({
      data: {
        name,
        country,
        imageUrl,
      },
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    console.error('Error creating city:', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'City already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    );
  }
}
