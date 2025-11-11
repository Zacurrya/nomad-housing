"use client"
import Link from "next/link";
import ImageWithFallback from "../ui/ImageWithFallback";
import { useCurrency } from "../context/CurrencyContext";
import { formatPriceFromUSDString } from "../../lib/currency";
interface LocationCardProps {
  image: string;
  city: string;
  country: string;
  priceFrom: string;
  listings: number;
}

export function LocationCard({ image, city, country, priceFrom, listings }: LocationCardProps) {
  const { currency } = useCurrency();

  const fallback = "/placeholder.png";

  const displayPrice = formatPriceFromUSDString(priceFrom, currency);

  return (
    <Link href={`/search?city=${encodeURIComponent(city)}`} className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block">
      {/* Image area */}
      <div className="aspect-4/3">
        <ImageWithFallback
          src={image}
          fallbackSrc={fallback}
          alt={`${city} image`}
          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-600 ease-out group-hover:scale-112 will-change-transform"
        />

        {/* gradient overlay that fades up from bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Listings badge */}
      <div className="listing-count-badge">
        {listings} {listings === 1 ? 'listing' : 'listings'}
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <div className="mb-2">
          <div>
            <h3 className="text-2xl mb-1 drop-shadow">{city}</h3>
            <p className="text-white/80 text-sm">{country}</p>
          </div>
        </div>

        <p className="text-lg mt-3">
          <span className="text-white/80">From </span>
          <span className="font-semibold">{displayPrice}</span>
          <span className="text-white/80 text-sm">/month</span>
        </p>
      </div>
    </Link>
  );
}

export default LocationCard;
