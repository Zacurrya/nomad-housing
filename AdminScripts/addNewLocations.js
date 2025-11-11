import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function addNewLocations() {
  try {
    // Create locations
    const locations = [
      {
        id: "shenzhen-loc",
        country: "China",
        city: "Shenzhen",
        district: "Futian"
      },
      {
        id: "osaka-loc",
        country: "Japan",
        city: "Osaka",
        district: "Namba"
      },
      {
        id: "chiang-mai-loc",
        country: "Thailand",
        city: "Chiang Mai",
        district: "Old City"
      },
      {
        id: "singapore-loc",
        country: "Singapore",
        city: "Singapore",
        district: "Marina Bay"
      },
      {
        id: "paris-loc",
        country: "France",
        city: "Paris",
        district: "Marais"
      }
    ];

    for (const loc of locations) {
      await prisma.location.upsert({
        where: { id: loc.id },
        update: {},
        create: loc
      });
      console.log(`✅ Created location: ${loc.city}, ${loc.country}`);
    }

    // Create listings
    const listings = [
      {
        id: "shenzhen-modern",
        title: "Modern Tech District Apartment",
        locationId: "shenzhen-loc",
        source: "internal",
        originalUrl: "https://nomad-housing.com/shenzhen-modern",
        beds: 2,
        baths: 1,
        area: 75,
        rentalPrice: 1800,
        featured: false,
        description: "Contemporary apartment in Shenzhen's bustling tech hub. Features modern amenities, high-speed internet, and easy access to metro stations. Perfect for professionals working in the tech industry."
      },
      {
        id: "osaka-cozy",
        title: "Traditional Japanese Apartment",
        locationId: "osaka-loc",
        source: "internal",
        originalUrl: "https://nomad-housing.com/osaka-cozy",
        beds: 1,
        baths: 1,
        area: 45,
        rentalPrice: 1400,
        featured: false,
        description: "Charming apartment in the heart of Osaka's Namba district. Experience authentic Japanese living with modern comforts. Walking distance to Dotonbori, restaurants, and nightlife."
      },
      {
        id: "chiang-mai-villa",
        title: "Tropical Garden Villa",
        locationId: "chiang-mai-loc",
        source: "internal",
        originalUrl: "https://nomad-housing.com/chiang-mai-villa",
        beds: 3,
        baths: 2,
        area: 120,
        rentalPrice: 1200,
        featured: true,
        description: "Beautiful villa with lush tropical garden in Chiang Mai's Old City. Peaceful retreat with traditional Thai architecture, modern kitchen, and outdoor dining area. Perfect for digital nomads seeking tranquility."
      },
      {
        id: "singapore-luxury",
        title: "Luxury Marina Bay Residence",
        locationId: "singapore-loc",
        source: "internal",
        originalUrl: "https://nomad-housing.com/singapore-luxury",
        beds: 2,
        baths: 2,
        area: 95,
        rentalPrice: 4200,
        featured: true,
        description: "Stunning high-rise apartment with breathtaking views of Marina Bay. Premium finishes, infinity pool, gym, and 24/7 concierge. Walking distance to financial district and world-class dining."
      },
      {
        id: "paris-classic",
        title: "Classic Parisian Flat",
        locationId: "paris-loc",
        source: "internal",
        originalUrl: "https://nomad-housing.com/paris-classic",
        beds: 1,
        baths: 1,
        area: 55,
        rentalPrice: 2400,
        featured: false,
        description: "Elegant Haussmann-style apartment in the trendy Marais district. High ceilings, original moldings, and large windows. Steps away from boutiques, cafés, and museums. Experience authentic Parisian living."
      }
    ];

    for (const listing of listings) {
      await prisma.listing.upsert({
        where: { id: listing.id },
        update: {},
        create: listing
      });
      console.log(`✅ Created listing: ${listing.title}`);
    }

    // Add images for each listing
    const images = [
      // Shenzhen
      {
        listingId: "shenzhen-modern",
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/273490014.jpg?k=6c9e1b5e5c7e6b1f3e1f2e3e4e5e6e7e8e9e0e1e2e3e4e5e6e7e8e9e0e1e2&o="
      },
      // Osaka
      {
        listingId: "osaka-cozy",
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-583404090286355597/original/d1e0e8e4-8b9f-4c4c-9d5e-4e5e6e7e8e9e.jpg"
      },
      // Chiang Mai
      {
        listingId: "chiang-mai-villa",
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/285165803.jpg?k=8b1f2e3e4e5e6e7e8e9e0e1e2e3e4e5e6e7e8e9e0e1e2e3e4e5e6e7e8e9e0e1&o="
      },
      // Singapore
      {
        listingId: "singapore-luxury",
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/267890123.jpg?k=9c0d1e2e3e4e5e6e7e8e9e0e1e2e3e4e5e6e7e8e9e0e1e2e3e4e5e6e7e8e9e0&o="
      },
      // Paris
      {
        listingId: "paris-classic",
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-52686784/original/e9a6c2d8-1b7d-4c5e-9d8f-1e2e3e4e5e6e.jpg"
      }
    ];

    for (const img of images) {
      await prisma.image.create({
        data: img
      });
    }
    console.log("✅ Added images for all listings");

    // Add amenities to listings
    const amenityMappings = [
      { listingId: "shenzhen-modern", amenities: ["Air conditioning", "Furnished", "Washer/Dryer", "Shared gym"] },
      { listingId: "osaka-cozy", amenities: ["Air conditioning", "Furnished"] },
      { listingId: "chiang-mai-villa", amenities: ["Shared pool", "Furnished", "Air conditioning", "Washer/Dryer"] },
      { listingId: "singapore-luxury", amenities: ["Shared gym", "Shared pool", "Furnished", "Washer/Dryer", "Air conditioning"] },
      { listingId: "paris-classic", amenities: ["Furnished", "Washer/Dryer"] }
    ];

    for (const mapping of amenityMappings) {
      for (const amenityName of mapping.amenities) {
        // Find or create amenity
        let amenity = await prisma.amenity.findFirst({
          where: { name: amenityName }
        });

        if (!amenity) {
          amenity = await prisma.amenity.create({
            data: {
              name: amenityName
            }
          });
        }

        // Connect the amenity to the listing
        await prisma.listing.update({
          where: { id: mapping.listingId },
          data: {
            amenities: {
              connect: { id: amenity.id }
            }
          }
        });
      }
      console.log(`✅ Added amenities for ${mapping.listingId}`);
    }

    console.log("\n🎉 Successfully added 5 new locations and listings!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addNewLocations();
