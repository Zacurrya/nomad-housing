import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { LocationCard } from "../components/ui/LocationCard";
import Locations from "../lib/Locations";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <Header />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Locations.map((loc) => (
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

        <div className="mt-8 flex justify-center">
          <button className="px-4 py-2 bg-white border rounded">Load more destinations</button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
