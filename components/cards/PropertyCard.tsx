"use client";
import ImageCarousel from "../ui/ImageCarousel";
import HeartBtn from "../user/FavouriteLocationBtn";
import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { formatPriceFromUSDString } from "../../lib/currency";
import { Bed, Bath, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export type Property = {
  id: string;
  title: string;
  description?: string;
  address?: string;
  area: number; // m²
  beds: number;
  baths: number;
  price: string; // e.g. "$3,200"
  images: string[]; // primary image at index 0
  featured?: boolean;
  sold?: boolean; // Track if this property has been sold
  district?: string;
  city: string;
  country: string;
  amenities?: string[];
  isFavourited?: boolean; // Track if this property is already favourited
};

type PropertyCardProps = {
  p: Property;
  onUnfavouriteAction?: (listingId: string) => void; // Callback when unfavourited
};

export default function PropertyCard({ p, onUnfavouriteAction }: PropertyCardProps) {
  const [fav, setFav] = useState(p.isFavourited || false);
  const { currency } = useCurrency();
  const router = useRouter();

  const handleFavouriteChange = (newValue: boolean) => {
    setFav(newValue);
    // If unfavouriting and callback provided, notify parent
    if (!newValue && onUnfavouriteAction) {
      onUnfavouriteAction(p.id);
    }
  };

  const trackView = async (listingId: string) => {
    try {
      await fetch('/api/listing/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const handleCardClick = () => {
    trackView(p.id);
    router.push(`/listing/${p.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to card
    trackView(p.id);
    router.push(`/listing/${p.id}`);
  };

  const displayPrice = formatPriceFromUSDString(p.price, currency);
  return (
    <div 
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-xl bg-white cursor-pointer transition-transform hover:scale-[1.02] ${p.featured ? 'border-2 border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.35)]' : 'border'} ${p.sold ? 'opacity-75' : ''}`}
    >
  <div className="relative">
        <ImageCarousel images={p.images} alt={p.title} />
        {p.sold && (
          <div className="absolute inset-0 overflow-hidden z-20 pointer-events-none">
            <div className="absolute top-[50%] left-[-20%] w-[140%] bg-red-600 text-white text-2xl font-bold py-3 text-center shadow-2xl transform -translate-y-1/2 rotate-[-35deg]">
              SOLD
            </div>
          </div>
        )}
        {p.featured && !p.sold && (
          <div className="absolute left-3 top-3 text-xs px-3 py-1 rounded-md bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">Featured</div>
        )}
  <HeartBtn isFavorite={fav} setIsFavoriteAction={handleFavouriteChange} listingId={p.id} />
      </div>
      <div className="p-4">
        <p className="font-medium text-sm">{p.title}</p>
        <div className="my-2 h-px bg-gray-200/70" />
        <p className="flex flex-row gap-1 text-sm text-gray-500"><MapPin className="size-5"/>{p.district ? `${p.district}, ` : ''}{p.city}</p>
        <div className="my-2.5 h-px bg-gray-200/70" />
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1"><Bed className="size-4.5"/>{p.beds}</span>
          <span className="inline-flex items-center gap-1"><Bath className="size-4.5"/>{p.baths}</span>
          <span className="inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            {p.area} m²
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm"><span className="text-gray-500">From</span> <span className="font-semibold">{displayPrice}</span><span className="text-gray-500 text-xs">/month</span></div>
          <button 
            onClick={handleViewDetails}
            className="px-3 py-1.5 text-sm rounded-md border bg-foreground text-white hover:bg-[#093e5a]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
