"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageCarousel from "@/components/ui/ImageCarousel";
import HeartBtn from "@/components/user/FavouriteLocationBtn";
import { useCurrency } from "@/components/context/CurrencyContext";
import { useAuthUI } from "@/components/context/AuthUIContext";
import { formatPriceFromUSDString } from "@/lib/currency";
import { Bed, Bath, MapPin, Square, ArrowLeft } from "lucide-react";
import type { Property } from "@/components/cards/PropertyCard";

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const { currency } = useCurrency();
  const { userId } = useAuthUI();
  const [listing, setListing] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log("Fetching listing with ID:", params.id);
        const url = userId 
          ? `/api/listing/${params.id}?userId=${userId}`
          : `/api/listing/${params.id}`;
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.error || "Failed to fetch listing");
        }
        
        const data = await response.json();
        console.log("Listing data:", data);
        setListing(data);
        setFav(data.isFavourited || false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id, userId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-gray-500">
              {error || "Listing not found"}
            </div>
            <div className="text-sm text-gray-400">
              Listing ID: {params.id as string}
            </div>
            <button
              onClick={() => router.push("/search")}
              className="px-4 py-2 bg-foreground text-white rounded-md hover:bg-[#093e5a]"
            >
              Back to Search
            </button>
          </div>
        </div>
      </main>
    );
  }

  const displayPrice = formatPriceFromUSDString(listing.price, currency);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="size-5" />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="relative rounded-xl overflow-hidden border">
                <ImageCarousel images={listing.images} alt={listing.title} />
                {listing.featured && (
                  <div className="absolute left-4 top-4 text-sm px-4 py-2 rounded-md bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">
                    Featured
                  </div>
                )}
                <div className="absolute right-4 top-4">
                  <HeartBtn
                    isFavorite={fav}
                    setIsFavoriteAction={setFav}
                    listingId={listing.id}
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="mt-6 bg-white rounded-xl p-4 border">
                <h1 className="text-3xl font-semibold text-gray-900">
                  {listing.title}
                </h1>

                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <MapPin className="size-5" />
                  <span>
                    {listing.district ? `${listing.district}, ` : ""}
                    {listing.city}, {listing.country}
                  </span>
                </div>

                <div className="mt-4 h-px bg-gray-200" />

                {/* Property Stats */}
                <div className="mt-4 flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Bed className="size-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                      <div className="font-semibold">{listing.beds}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="size-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                      <div className="font-semibold">{listing.baths}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="size-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Area</div>
                      <div className="font-semibold">{listing.area} m²</div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {listing.amenities && listing.amenities.length > 0 && (
                  <>
                    <div className="mt-4 h-px bg-gray-200" />
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {listing.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <svg
                              className="size-5 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="capitalize">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Description */}
                {listing.description && (
                  <>
                    <div className="mt-4 h-px bg-gray-200" />
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold mb-3">About this place</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {listing.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border sticky top-6 space-y-6">
                <div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {displayPrice}
                    <span className="text-base font-normal text-gray-500">
                      /month
                    </span>
                  </div>

                  <div className="mt-6">
                    <button className="w-full py-3 bg-foreground text-white rounded-md hover:bg-[#093e5a] font-medium transition-colors">
                      Contact Host
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    You won&apos;t be charged yet
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Service fee</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span className="font-medium">Included</span>
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(
                        `${listing.district ? listing.district + ', ' : ''}${listing.city}, ${listing.country}`
                      )}&zoom=12`}
                    />
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="size-4 mt-0.5 shrink-0" />
                    <span>
                      {listing.district && `${listing.district}, `}
                      {listing.city}, {listing.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
