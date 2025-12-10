
import db from "../lib/db/prisma";

async function main() {
    console.log("Starting price migration (cents -> dollars)...");

    const listings = await db.listing.findMany();
    console.log(`Found ${listings.length} listings to update.`);

    let updatedCount = 0;

    for (const listing of listings) {
        const updateData: any = {};

        if (listing.rentalPrice !== null) {
            updateData.rentalPrice = Math.round(listing.rentalPrice / 100);
        }

        if (listing.purchasePrice !== null) {
            updateData.purchasePrice = Math.round(listing.purchasePrice / 100);
        }

        if (listing.deposit !== null) {
            updateData.deposit = Math.round(listing.deposit / 100);
        }

        if (Object.keys(updateData).length > 0) {
            await db.listing.update({
                where: { id: listing.id },
                data: updateData,
            });
            updatedCount++;
        }
    }

    console.log(`Successfully updated prices for ${updatedCount} listings.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
