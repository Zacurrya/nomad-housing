import { Suspense } from "react";
import Header from "./_components/Header";
import { LocationCard } from "./_components/LocationCard";
import LocationCarousel from "./_components/LocationCarousel";
import { getTrendingLocations } from "@/lib/db/queries";
// types
type TrendingRow = { city: string; country: string; imageUrl?: string; priceFrom: number; listings: number };

type Location = {
  city: string;
  country: string;
  image: string;
  priceFrom: string; // USD string like "$1999"
  listings: number;
};

export const metadata = {
  title: "Nomad",
  description: "Finding homes globally, made easy.",
  icons: {
    icon: "/favicon.ico",
  },
}
export default async function Home() {
  // Server-side: get top trending locations by favourites (hearts)
  const trending = await getTrendingLocations(6);

  const locations: Location[] = (trending as TrendingRow[]).map((t) => ({
    city: t.city,
    country: t.country,
    image: t.imageUrl ?? '/placeholder.png',
    priceFrom: `$${Math.round(t.priceFrom ?? 0)}`,
    listings: t.listings,
  }));

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="h-20 bg-gray-900" />}>
          <Header />
        </Suspense>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trending Locations</h2>
          <p className="text-gray-600 mb-8">Most popular locations this month</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <LocationCard
                key={loc.city}
                city={loc.city}
                country={loc.country}
                image={loc.image}
                listings={loc.listings}
                priceFrom={loc.priceFrom}
              />
            ))}
          </div>
        </section>

        <LocationCarousel
          category="digital-nomad-hubs"
          title="Digital Nomad Hubs"
          subtitle="Work remotely from anywhere with reliable WiFi and vibrant coworking communities"
        />

        <LocationCarousel
          category="coastal-escapes"
          title="Coastal Paradise"
          subtitle="Beachfront living with stunning ocean views and year-round sunshine"
        />

        <LocationCarousel
          category="old-world-charm"
          title="Historic Charm"
          subtitle="Experience timeless architecture and rich cultural heritage in these classic cities"
        />

        <LocationCarousel
          category="future-forward"
          title="Future Forward"
          subtitle="Experience cutting-edge technology and modern living in these innovative urban centers"
        />
      </main>
    </>
  );
}
