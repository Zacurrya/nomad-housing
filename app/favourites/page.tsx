"use client";
import { useEffect, useState } from "react";
import { useAuthUI } from "@/components/context/AuthUIContext";
import PropertyCard, { type Property } from "@/components/cards/PropertyCard";
import SearchBar from "@/components/ui/ListingSearchBar";

export default function FavouritesPage() {
  const { isAuthenticated, openLogin, userId } = useAuthUI();
  const [favourites, setFavourites] = useState<Property[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    let mounted = true;
    const loadFavourites = async () => {
      try {
        const res = await fetch("/api/favourites", {
          headers: {
            "x-user-id": userId,
          },
        });
        const data: Property[] = await res.json();
        if (mounted) {
          const favouritedData = data.map((item) => ({
            ...item,
            isFavourited: true,
            featured: false,
          }));
          setFavourites(favouritedData);
        }
      } catch (e) {
        console.error("Failed to load favourites", e);
      }
    };

    loadFavourites();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, userId]);

  const handleUnfavourite = (listingId: string) => {
    setFavourites((prev) => prev.filter((item) => item.id !== listingId));
  };

  if (!isAuthenticated) {
    return (
      <>
        <head>
          <title>My Favourites | Nomad</title>
        </head>
        <main>
          <SearchBar />
          <section className="max-w-6xl mx-auto px-6 py-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-16 mx-auto text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <h1 className="text-2xl font-semibold text-gray-900">Sign in to view your favourites</h1>
              <p className="text-sm text-gray-600">
                Create an account or sign in to save and view your favourite properties.
              </p>
              <button
                onClick={() => openLogin("favourite")}
                className="inline-flex items-center gap-2 rounded-md bg-[#0a2540] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#093e5a]"
              >
                Sign In
              </button>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <head>
        <title>My Favourites | Nomad</title>
      </head>
      <main>
        <SearchBar />
        <section className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Favourites</h1>
          {favourites.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-16 mx-auto text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <p className="text-gray-600">You haven&apos;t saved any favourites yet.</p>
              <p className="text-sm text-gray-500">
                Browse properties and click the heart icon to save them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favourites.map((p) => (
                <PropertyCard key={p.id} p={p} onUnfavouriteAction={handleUnfavourite} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
