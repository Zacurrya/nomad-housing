import db from './prisma';
import { unstable_cache as cache } from 'next/cache';
// Local light-weight types for results to avoid depending on prisma client exported types
type CityRow = { country: string };
type AmenityRow = { name: string };
type FavouriteRow = { listingId: string };
type ImageRow = { url: string };
type LocationRow = { district?: string | null; city?: string | null; country?: string | null } | null;
type ListingWithRelations = {
    id: string;
    title: string;
    description?: string | null;
    area?: number | null;
    beds: number;
    baths: number;
    rentalPrice?: number | null;
    images: ImageRow[];
    featured?: boolean | null;
    sold?: boolean | null;
    location?: LocationRow;
    amenities: AmenityRow[];
};

/*
    Database query helpers used by API routes.
    - getCities: cached list of City rows
    - getCountries: cached list of country names
    - getAmenities: cached amenity names
    - getListings: flexible listings fetch with optional filters (cities, bedrooms, limit)
*/

export const getCities = cache(
    async () => {
        try {
            return await db.city.findMany({ orderBy: { name: 'asc' } });
        } catch (err) {
            console.error('getCities error', err);
            throw err;
        }
    },
    ['get_cities'],
    { revalidate: 60 }
);

export const getCountries = cache(
    async () => {
        try {
            const rows = await db.city.findMany({ select: { country: true } });
            const set = new Set(rows.map((r: CityRow) => r.country));
            return Array.from(set).sort();
        } catch (err) {
            console.error('getCountries error', err);
            throw err;
        }
    },
    ['get_countries'],
    { revalidate: 60 }
);

export const getAmenities = cache(
    async () => {
        try {
            const amenities = await db.amenity.findMany({ orderBy: { name: 'asc' } });
            return amenities.map((a: AmenityRow) => a.name);
        } catch (err) {
            console.error('getAmenities error', err);
            throw err;
        }
    },
    ['get_amenities'],
    { revalidate: 60 }
);

export type ListingsFilter = {
    cities?: string[];
    bedrooms?: number; // minimum number of bedrooms
    limit?: number;
    userId?: string; // optional: used to mark favourites
    showSold?: boolean;
};

/**
 * Fetch listings with optional filters. Returns array shaped for frontend consumption.
 */
export async function getListings(filter: ListingsFilter = {}) {
    const { cities = [], bedrooms, limit = 100, userId, showSold = false } = filter;

    const where: Record<string, unknown> = {};
    if (!showSold) where.sold = false;
    if (bedrooms !== undefined && bedrooms !== null) {
        where.beds = { gte: bedrooms };
    }
    if (cities && cities.length > 0) {
        // filter by related Location.city (case-insensitive match)
        where.location = { city: { in: cities } };
    }

    try {
        const listings = await db.listing.findMany({
            where,
            take: limit,
            include: {
                location: true,
                images: { select: { url: true } },
                amenities: { select: { name: true } },
            },
            orderBy: { featured: 'desc' }
        });

        let favouritedSet = new Set<string>();
        if (userId) {
            const favs = await db.userFavourite.findMany({ where: { userId }, select: { listingId: true } });
            favouritedSet = new Set(favs.map((f: FavouriteRow) => f.listingId));
        }

        const mapped = listings.map((l: ListingWithRelations) => ({
            id: l.id,
            title: l.title,
            description: l.description ?? undefined,
            address: undefined, // normalized address not stored separately; use district+city when needed elsewhere
            area: l.area ?? 0,
            beds: l.beds,
            baths: l.baths,
            // Keep the same formatting as previous API route (dollars shown as whole number string)
            price: `$${(l.rentalPrice ?? 0).toLocaleString('en-US')}`,
            images: l.images.map((i: ImageRow) => i.url),
            featured: l.featured ?? false,
            sold: l.sold ?? false,
            district: l.location?.district ?? undefined,
            city: l.location?.city ?? '',
            country: l.location?.country ?? '',
            amenities: l.amenities.map((a: AmenityRow) => a.name),
            isFavourited: favouritedSet.has(l.id),
        }));

        return mapped;
    } catch (err) {
        console.error('getListings error', err);
        throw err;
    }
}

// Get trending locations by number of favourites (hearts). Returns an array
// of objects with city, country, imageUrl, priceFrom (number), and listings count.
export const getTrendingLocations = cache(
    async (limit = 6) => {
        try {
            // Fetch recent listings with location and favouritedBy relation
            const listings = await db.listing.findMany({
                include: {
                    location: true,
                    images: { select: { url: true } },
                    favouritedBy: { select: { id: true } },
                },
            });

            // Build aggregation per city
            const agg = new Map<string, { city: string; country: string; hearts: number; listings: number; minPrice: number; sampleImage?: string }>();

            for (const l of listings) {
                const city = l.location?.city ?? "";
                const country = l.location?.country ?? "";
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

            // Convert to array and sort by hearts desc, then listings desc
            const arr = Array.from(agg.values())
                .map(a => ({ ...a }))
                .sort((x, y) => (y.hearts - x.hearts) || (y.listings - x.listings))
                .slice(0, limit);

            // Try to prefer a hero image from the City table when available.
            const cityNames = arr.map(a => a.city).filter(Boolean);
            const cityRows = await db.city.findMany({ where: { name: { in: cityNames } }, select: { name: true, imageUrl: true } });
            const cityImageMap: Record<string, string | undefined> = {};
            for (const c of cityRows) cityImageMap[c.name] = c.imageUrl;

            // Map to output shape and fill missing minPrice; prefer city image.
            return arr.map(a => ({
                city: a.city,
                country: a.country,
                imageUrl: cityImageMap[a.city] ?? a.sampleImage ?? undefined,
                priceFrom: a.minPrice === Number.POSITIVE_INFINITY ? 0 : a.minPrice,
                listings: a.listings,
                hearts: a.hearts,
            }));
        } catch (err) {
            console.error('getTrendingLocations error', err);
            throw err;
        }
    },
    ['get_trending_locations_v2'],
    { revalidate: 60 }
);
