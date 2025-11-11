"use client";
import ImageCarousel from "../ui/ImageCarousel";
import HeartBtn from "../user/FavouriteLocationBtn";
import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { formatPriceFromUSDString } from "../../lib/currency";
import { Bed, Bath, MapPin, Square } from "lucide-react";
import { useRouter } from "next/navigation";

export type Property = {
  id: string;
  title: string;
  description?: string;
  area: number; // m²
  beds: number;
  baths: number;
  price: string; // e.g. "$3,200"
  images: string[]; // primary image at index 0
  featured?: boolean;
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

  const handleCardClick = () => {
    router.push(`/listing/${p.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to card
    router.push(`/listing/${p.id}`);
  };

  const displayPrice = formatPriceFromUSDString(p.price, currency);
  return (
    <div 
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-xl bg-white cursor-pointer transition-transform hover:scale-[1.02] ${p.featured ? 'border-2 border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.35)]' : 'border'}`}
    >
  <div className="relative">
        <ImageCarousel images={p.images} alt={p.title} />
        {p.featured && (
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
          <span className="inline-flex items-center gap-1"><Square className="size-4.5"/>{p.area} m²</span>
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
