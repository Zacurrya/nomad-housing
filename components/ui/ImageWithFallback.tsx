"use client";

import React, { ImgHTMLAttributes, useEffect, useState } from "react";
import { StaticImageData } from "next/image";

type ImageWithFallbackProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src?: string | StaticImageData;
  fallbackSrc: string | StaticImageData;
  alt?: string;
};

function toSrcString(value?: string | StaticImageData) {
  if (!value) return undefined;
  return typeof value === "string" ? value : (value as StaticImageData).src;
}

export const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) => {
  const primary = toSrcString(src);
  const fallback = toSrcString(fallbackSrc) || "";

  const [displaySrc, setDisplaySrc] = useState<string>(primary ?? fallback);

  useEffect(() => {
    const next = primary ?? fallback;
    if (next !== displaySrc) setDisplaySrc(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, fallback]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={displaySrc}
      onError={() => {
        if (displaySrc !== fallback) setDisplaySrc(fallback);
      }}
      {...(props as ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};

export default ImageWithFallback;
