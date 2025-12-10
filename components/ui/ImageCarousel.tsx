"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import ImageWithFallback from "./ImageWithFallback";

type ImageCarouselProps = {
  images: string[] | undefined;
  alt: string;
  className?: string;
};

export default function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const imgs = useMemo(() => 
    images && images.length > 0 ? images : ["/placeholder.png"],
    [images]
  );
  const [index, setIndex] = useState(0);

  const hasMultiple = imgs.length > 1;

  // Preload all images when component mounts
  useEffect(() => {
    imgs.forEach((src) => {
      if (src !== "/placeholder.png") {
        const img = new Image();
        img.src = src;
      }
    });
  }, [imgs]);

  const goPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent event bubbling to parent card
    setIndex((i) => (i === 0 ? imgs.length - 1 : i - 1));
  }, [imgs.length]);

  const goNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent event bubbling to parent card
    setIndex((i) => (i === imgs.length - 1 ? 0 : i + 1));
  }, [imgs.length]);

  return (
    <div className={`relative aspect-4/3 bg-gray-100 ${className ?? ""}`}>
      {/* Image */}
      <ImageWithFallback
        src={imgs[index]}
        alt={alt}
        fallbackSrc="/placeholder.png"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Controls */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/55"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 1 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination dots */}
      {hasMultiple && (
        <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1">
          {imgs.map((_, i) => (
            <span
              key={`${alt}-${i}`}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
