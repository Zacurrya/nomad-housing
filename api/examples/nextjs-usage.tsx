/**
 * Next.js Usage Example
 * 
 * This example shows how to use the Real Estate API with Next.js
 * and display property listings with images using the Next.js Image component.
 */

import Image from 'next/image';
import { useState, useEffect } from 'react';

// TypeScript interface for property listing
interface PropertyListing {
  title: string;
  price: string;
  location: string;
  bedrooms: string;
  property_type: string;
  url: string;
  description: string;
  available_date: string;
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
}

interface APIResponse {
  success: boolean;
  count: number;
  listings: PropertyListing[];
  query: {
    city: string;
    bedrooms: number | null;
    min_price: number | null;
    max_price: number | null;
    postcode: string | null;
    property_type: string | null;
    max_results: number;
  };
}

export default function PropertyListings() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch property listings from your API
    const fetchListings = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/properties?city=London&bedrooms=2&max_results=10'
        );
        const data: APIResponse = await response.json();
        
        if (data.success) {
          setListings(data.listings);
        } else {
          setError('Failed to fetch listings');
        }
      } catch (err) {
        setError('Error connecting to API');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <PropertyCard key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({ listing }: { listing: PropertyListing }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Property Image - Using Next.js Image component */}
      {listing.images && listing.images.length > 0 && (
        <div className="relative h-64 w-full">
          <Image
            src={listing.images[0].src}
            alt={listing.images[0].alt}
            width={listing.images[0].width}
            height={listing.images[0].height}
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD..."
          />
        </div>
      )}
      
      {/* Property Details */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          {listing.title}
        </h2>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-blue-600">
            {listing.price}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {listing.bedrooms}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {listing.property_type}
          </span>
          
          {listing.available_date && (
            <span className="text-green-600">
              Available: {listing.available_date}
            </span>
          )}
        </div>
        
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Property
        </a>
      </div>
      
      {/* Additional Images Gallery (if available) */}
      {listing.images && listing.images.length > 1 && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {listing.images.slice(1, 4).map((image, idx) => (
              <div key={idx} className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Next.js Configuration (next.config.js)
 * 
 * Add this to your next.config.js to allow images from OpenRent:
 * 
 * module.exports = {
 *   images: {
 *     domains: ['imagescdn.openrent.co.uk', 'www.openrent.com'],
 *   },
 * }
 */
