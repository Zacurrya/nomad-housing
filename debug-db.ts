
import db from "./lib/db/prisma";

// Mock implementation of getTrendingLocations logic
async function verifyTrendingLogic(limit = 6) {
    try {
        console.log("Fetching listings with relations...");
        const listings = await db.listing.findMany({
            include: {
                location: true,
                images: { select: { url: true } },
                favouritedBy: { select: { id: true } },
            },
        });
        console.log(`Found ${listings.length} listings`);

        const agg = new Map<string, { city: string; country: string; hearts: number; listings: number; minPrice: number; sampleImage?: string }>();

        for (const l of listings) {
            const city = l.location?.city ?? "";
            const country = l.location?.country ?? "";

            // console.log(`Processing listing ${l.id}, city: ${city}`);

            if (!agg.has(city)) {
                agg.set(city, { city, country, hearts: 0, listings: 0, minPrice: Number.POSITIVE_INFINITY, sampleImage: l.images?.[0]?.url });
            }
            const entry = agg.get(city)!;
            entry.hearts += (l.favouritedBy?.length ?? 0);
            entry.listings += 1;
            const price = Number(l.rentalPrice ?? 0);
            if (price && price < entry.minPrice) entry.minPrice = price;
            if (!entry.sampleImage && l.images?.[0]?.url) entry.sampleImage = l.images[0].url;
        }

        console.log(`aggregated cities: ${Array.from(agg.keys()).join(', ')}`);

        const arr = Array.from(agg.values())
            .map(a => ({ ...a }))
            .sort((x, y) => (y.hearts - x.hearts) || (y.listings - x.listings))
            .slice(0, limit);

        const cityNames = arr.map(a => a.city).filter(Boolean);
        const cityRows = await db.city.findMany({ where: { name: { in: cityNames } }, select: { name: true, imageUrl: true } });
        const cityImageMap: Record<string, string | undefined> = {};
        for (const c of cityRows) cityImageMap[c.name] = c.imageUrl;

        return arr.map(a => ({
            city: a.city,
            country: a.country,
            imageUrl: cityImageMap[a.city] ?? a.sampleImage ?? undefined,
            priceFrom: a.minPrice === Number.POSITIVE_INFINITY ? 0 : a.minPrice,
            listings: a.listings,
            hearts: a.hearts,
        }));
    } catch (err) {
        console.error('verifyTrendingLogic error', err);
        throw err;
    }
}

async function main() {
    console.log("Checking DB content...");
    const listingsCount = await db.listing.count();
    console.log(`Total listings in DB: ${listingsCount}`);

    if (listingsCount === 0) {
        console.log("No listings found! This is why home page is empty.");
        process.exit(0);
    }

    const locationsCount = await db.location.count();
    console.log(`Total locations in DB: ${locationsCount}`);

    console.log("Running trending logic...");
    const trending = await verifyTrendingLogic(100);

    console.log(`Trending logic returned ${trending.length} items`);
    console.log(JSON.stringify(trending, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
