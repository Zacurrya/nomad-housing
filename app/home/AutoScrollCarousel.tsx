"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselLocation = {
  city: string;
  country: string;
  image: string;
  priceFrom: string;
  listings: number;
  totalFavourites: number;
};

interface AutoScrollCarouselProps {
  category: string;
  title: string;
  subtitle: string;
}

export default function AutoScrollCarousel({ category, title, subtitle }: AutoScrollCarouselProps) {
  const [locations, setLocations] = useState<CarouselLocation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`/api/carousel-locations?category=${category}`);
        const data = await response.json();
        // Duplicate the locations to create seamless infinite scroll
        setLocations([...data, ...data]);
      } catch (error) {
        console.error('Error fetching carousel locations:', error);
      }
    };

    fetchLocations();
  }, [category]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || locations.length === 0) return;

    let animationId: number;
    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += 0.5;
        
        // Reset to beginning when halfway through (seamless loop)
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [locations]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-md transition-all hover:scale-110 border border-gray-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5 text-gray-800" />
          </button>
          <button
            onClick={scrollRight}
            className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-md transition-all hover:scale-110 border border-gray-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5 text-gray-800" />
          </button>
        </div>
      </div>
      
      <div className="relative">

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-visible scroll-smooth px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
        {locations.map((location, index) => (
          <Link 
            key={`${location.city}-${index}`}
            href={`/search?city=${encodeURIComponent(location.city)}`}
            className="relative group shrink-0 w-[320px] bg-white rounded-xl shadow-sm transform-gpu transition-all duration-200 hover:shadow-md hover:scale-105 hover:-translate-y-2 hover:z-30 cursor-pointer"
          >
            <div className="relative h-64 bg-gray-200 rounded-xl overflow-hidden">
              {location.image && location.image !== '/placeholder.png' ? (
                <Image
                  src={location.image}
                  alt={`${location.city} image`}
                  fill
                  className="object-cover"
                  unoptimized={!location.image.includes('images.unsplash.com')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Listings badge */}
              <div className="listing-count-badge">
                {location.listings} {location.listings === 1 ? 'listing' : 'listings'}
              </div>
              
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                <h3 className="text-2xl font-bold drop-shadow-lg">{location.city}</h3>
                <p className="text-white/90 text-sm mt-1">{location.country}</p>
                <p className="text-lg font-semibold mt-3">
                  From {location.priceFrom}
                  <span className="text-sm font-normal text-white/80">/month</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
      
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
