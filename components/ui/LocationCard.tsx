"use client"
import { Heart } from "lucide-react";
import { useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

interface LocationCardProps {
  image: string;
  city: string;
  country: string;
  priceFrom: string;
  listings: number;
}

export function LocationCard({ image, city, country, priceFrom, listings }: LocationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const fallback = "/placeholder.png";

  return (
    <div className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image area */}
      <div className="aspect-4/3 relative w-full overflow-hidden bg-gray-200">
        <ImageWithFallback
          src={image}
          fallbackSrc={fallback}
          alt={`${city} image`}
          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
        />

        {/* gradient overlay that fades up from bottom */}
  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        aria-pressed={isFavorite}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 z-30"
      >
        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 stroke-red-500" : "stroke-slate-700"}`}/>
      </button>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-2xl mb-1 drop-shadow">{city}</h3>
            <p className="text-white/80 text-sm">{country}</p>
          </div>

          <div className="ml-4 shrink-0 self-end">
            <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full shadow">{listings} listings</div>
          </div>
        </div>

        <p className="text-lg mt-3">
          <span className="text-white/80">From </span>
          <span className="font-semibold">{priceFrom}</span>
          <span className="text-white/80 text-sm">/month</span>
        </p>
      </div>
    </div>
  );
}

export default LocationCard;
