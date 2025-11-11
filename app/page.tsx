"use client";
import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { LocationCard } from "../components/cards/LocationCard";

type Location = {
  city: string;
  country: string;
  image: string;
  priceFrom: string;
  listings: number;
};

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <>
      <head><title>Nomad Housing</title></head>
      <main className="min-h-screen bg-gray-50">
          <Header />
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <LocationCard
                key={loc.city}
                city={loc.city}
                country={loc.country}
                image={loc.image}
                listings={loc.listings}
                priceFrom={`${loc.priceFrom}00`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
