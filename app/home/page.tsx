"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "./Header";
import { LocationCard } from "../../components/cards/LocationCard";
import AutoScrollCarousel from "./AutoScrollCarousel";

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
        <Head>
          <title>Nomad Housing</title>
        </Head>
      <main className="min-h-screen bg-gray-50">
          <Header />
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Locations</h2>
          <p className="text-gray-600 mb-8">Most popular locations this month</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

        <AutoScrollCarousel 
          category="digital-nomad-hubs"
          title="Digital Nomad Hubs"
          subtitle="Work remotely from anywhere with reliable WiFi and vibrant coworking communities"
        />

        <AutoScrollCarousel 
          category="coastal-escapes"
          title="Coastal Paradise"
          subtitle="Beachfront living with stunning ocean views and year-round sunshine"
        />

        <AutoScrollCarousel 
          category="old-world-charm"
          title="Historic Charm"
          subtitle="Experience timeless architecture and rich cultural heritage in these classic cities"
        />

        <AutoScrollCarousel 
          category="future-forward"
          title="Future Forward"
          subtitle="Experience cutting-edge technology and modern innovation in Asia's tech capitals"
        />
      </main>
    </>
  );
}
