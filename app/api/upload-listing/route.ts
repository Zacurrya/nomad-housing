import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      userId,
      title,
      description,
      beds,
      baths,
      area,
      rentalPrice,
      address,
      city,
      district,
      country,
      images, // Array of image URLs
      amenities, // Array of amenity names
    } = body;

    // Validate required fields
    if (!userId || !title || !beds || !baths || !rentalPrice || !city || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or find location
    const locationId = `${city.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const location = await prisma.location.create({
      data: {
        id: locationId,
        city,
        district: district || null,
        country,
      },
    });

    // Create listing
    const listingId = `user-${userId}-${Date.now()}`;
    const listing = await prisma.listing.create({
      data: {
        id: listingId,
        title,
        description: description || null,
        source: 'user-upload',
        originalUrl: `https://nomad-housing.com/listing/${listingId}`,
        rentalPrice: parseInt(rentalPrice),
        beds: parseInt(beds),
        baths: parseInt(baths),
        area: area ? parseInt(area) : null,
        featured: false,
        locationId: location.id,
        userId,
      },
    });

    // Add images
    if (images && images.length > 0) {
      await prisma.image.createMany({
        data: images.map((url: string) => ({
          listingId: listing.id,
          url,
        })),
      });
    }

    // Add amenities
    if (amenities && amenities.length > 0) {
      for (const amenityName of amenities) {
        // Find or create amenity
        let amenity = await prisma.amenity.findFirst({
          where: { name: amenityName },
        });

        if (!amenity) {
          amenity = await prisma.amenity.create({
            data: { name: amenityName },
          });
        }

        // Connect amenity to listing
        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            amenities: {
              connect: { id: amenity.id },
            },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      listingId: listing.id,
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
