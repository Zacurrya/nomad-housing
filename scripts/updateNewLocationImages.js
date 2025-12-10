import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function updateNewLocationImages() {
  try {
    // Delete old images
    await prisma.image.deleteMany({
      where: {
        listingId: {
          in: ["osaka-cozy", "chiang-mai-villa", "shenzhen-modern", "singapore-luxury", "paris-classic"]
        }
      }
    });
    console.log("✅ Deleted old images");

    // Add new images
    const images = [
      {
        listingId: "osaka-cozy",
        url: "https://images.unsplash.com/photo-1654755826693-d15da4cdbb9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
      },
      {
        listingId: "chiang-mai-villa",
        url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1470&auto=format&fit=crop"
      },
      {
        listingId: "shenzhen-modern",
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1470&auto=format&fit=crop"
      },
      {
        listingId: "singapore-luxury",
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop"
      },
      {
        listingId: "paris-classic",
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1480&auto=format&fit=crop"
      }
    ];

    for (const img of images) {
      await prisma.image.create({
        data: img
      });
    }
    console.log("✅ Added new images for all listings");

    console.log("\n🎉 Successfully updated images!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateNewLocationImages();
