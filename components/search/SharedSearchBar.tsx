"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Power } from "lucide-react";

const geniusPlaceholders = [
    "a 2 bedroom flat in Paris with a gym",
    "a quiet studio in Tokyo near a train station",
    "a house in London for a family of 4",
    "a loft in New York with a nice view",
    "a pet-friendly apartment in Berlin",
];

type LocationSuggestion = {
    city: string;
    country: string;
};

interface SharedSearchBarProps {
    variant?: "hero" | "compact";
}

export default function SharedSearchBar({ variant = "hero" }: SharedSearchBarProps) {
    const searchParams = useSearchParams();
    const cityParam = searchParams.get('city');
    
    const initialQuery = useMemo(() => cityParam || "", [cityParam]);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [placeholder, setPlaceholder] = useState(variant === 'hero' ? "Search by city, country, or region" : "Search by city or location");
    const [isGeniusSearching, setIsGeniusSearching] = useState(false);
    const [isGeniusMode, setIsGeniusMode] = useState(false);
    const [type, setType] = useState("Any type");
    const [more, setMore] = useState("Any");
    const [locations, setLocations] = useState<LocationSuggestion[]>([]);
    const [hideDropdown, setHideDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isGeniusMode) {
            let placeholderIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            const intervalId = setInterval(() => {
                const currentPlaceholder = geniusPlaceholders[placeholderIndex];
                
                if (isDeleting) {
                    setPlaceholder(currentPlaceholder.substring(0, charIndex - 1));
                    charIndex--;
                } else {
                    setPlaceholder(currentPlaceholder.substring(0, charIndex + 1));
                    charIndex++;
                }

                if (!isDeleting && charIndex === currentPlaceholder.length) {
                    isDeleting = true;
                    // Pause at end of word
                    setTimeout(() => {}, 1500); 
                }
                
                if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    placeholderIndex = (placeholderIndex + 1) % geniusPlaceholders.length;
                }
            }, isDeleting ? 50 : 120);

            return () => clearInterval(intervalId);
        } else {
            setPlaceholder(variant === 'hero' ? "Search by city, country, or region" : "Search by city or location");
        }
    }, [isGeniusMode, variant]);

    useEffect(() => {
        fetch("/api/locations")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (data && typeof data === 'object' && 'error' in data) {
                    console.error("API error:", data.error);
                    setLocations([]);
                    return;
                }
                if (Array.isArray(data)) {
                    const locationList = data.map((loc: { city: string; country: string }) => ({
                        city: loc.city,
                        country: loc.country,
                    }));
                    setLocations(locationList);
                } else {
                    console.error("Expected array from /api/locations, got:", typeof data);
                    setLocations([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch locations:", err);
                setLocations([]);
            });
    }, []);

    const suggestions = useMemo(() => {
        if (searchQuery.length < 2) return [];
        const searchLower = searchQuery.toLowerCase();
        return locations.filter((loc) =>
            loc.city.toLowerCase().includes(searchLower) ||
            loc.country.toLowerCase().includes(searchLower)
        );
    }, [searchQuery, locations]);

    const showSuggestions = suggestions.length > 0 && !hideDropdown;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setHideDropdown(true);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setHideDropdown(true);
        } else {
            router.push("/search");
        }
    };

    const handleGeniusSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsGeniusSearching(true);
        try {
            const response = await fetch('/api/llm-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: searchQuery }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Genius Search failed:", errorData);
                // You might want to show a user-facing error message here
                return;
            }

            const searchParams = await response.json();
            const query = new URLSearchParams();
            
            // Mark this as a genius search result
            query.set('geniusSearch', 'true');

            for (const key in searchParams) {
                if (searchParams[key] !== null && searchParams[key] !== undefined) {
                    // Handle array parameters (amenities, cities, countries)
                    if (Array.isArray(searchParams[key])) {
                        searchParams[key].forEach((value: string) => query.append(key, value));
                    } else {
                        query.set(key, searchParams[key].toString());
                    }
                }
            }

            router.push(`/search?${query.toString()}`);

        } catch (error) {
            console.error("An error occurred during Genius Search:", error);
        } finally {
            setIsGeniusSearching(false);
        }
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            const searchFunction = isGeniusMode ? handleGeniusSearch : handleSearch;
            searchFunction();
        } else {
            router.push("/search");
        }
    };

    const handleSuggestionClick = (location: LocationSuggestion) => {
        setSearchQuery(`${location.city}, ${location.country}`);
        setHideDropdown(true);
        router.push(`/search?city=${encodeURIComponent(location.city)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : prev);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                handleSuggestionClick(suggestions[selectedIndex]);
            } else {
                const searchFunction = isGeniusMode ? handleGeniusSearch : handleSearch;
                searchFunction();
            }
        } else if (e.key === "Escape") {
            setHideDropdown(true);
            setSelectedIndex(-1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setHideDropdown(false);
        setSelectedIndex(-1);
    };

    if (variant === "hero") {
        return (
            <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                <h1 className="text-xl md:text-lg font-normal">Find your next home, anywhere</h1>
                <p className="mt-3 text-xl text-white/80">Discover furnished houses in the world&apos;s most exciting cities</p>
                <div className="mt-8 mb-3">
                    <div className="relative max-w-3xl mx-auto" ref={dropdownRef}>
                        <div className={`relative bg-white shadow-xl p-1 border-4 border-white/20 ${showSuggestions ? 'rounded-t-3xl' : 'rounded-3xl'}`}>
                            <input
                                aria-label="search"
                                placeholder={placeholder}
                                value={searchQuery}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setHideDropdown(false)}
                                className="w-full rounded-3xl py-4 px-6 pr-52 text-gray-800 outline-none"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button
                                    onClick={() => setIsGeniusMode(!isGeniusMode)}
                                    className={`px-4 py-2.5 rounded-full shadow-sm transition-colors text-sm flex items-center gap-2 ${
                                        isGeniusMode 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Genius</span>
                                </button>
                                <button 
                                    onClick={handleSearchSubmit}
                                    disabled={isGeniusSearching}
                                    className="bg-foreground text-white px-4 py-2.5 rounded-full shadow-sm hover:bg-foreground/90 transition-colors flex items-center gap-2 text-sm disabled:bg-opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isGeniusSearching ? 'Thinking...' : 'Search'}
                                </button>
                            </div>
                        </div>
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-xl border-4 border-t-0 border-white/20 overflow-hidden z-50">
                                <div className="border-t border-gray-200" />
                                <ul className="max-h-64 overflow-y-auto">
                                    {suggestions.map((location, index) => (
                                        <li key={`${location.city}-${index}`}>
                                            <button
                                                onClick={() => handleSuggestionClick(location)}
                                                className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                                                    selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <div className="text-gray-900 font-medium">{location.city}</div>
                                                    <div className="text-sm text-gray-500">{location.country}</div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full bg-white justify-between shadow-stone-400 shadow-sm mx-auto px-6 py-6">
            <div className="w-full max-w-7xl mx-auto text-center items-center">
                <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }} className="flex w-full items-stretch justify-between gap-3">
                    <div className="flex-1 min-w-0 relative" ref={dropdownRef}>
                        <div className="h-10 flex items-center rounded-md bg-gray-50 border border-gray-200 px-4 text-sm text-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsGeniusMode(!isGeniusMode)}
                                className={`mr-2 p-1.5 rounded-full transition-colors ${
                                    isGeniusMode 
                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                }`}
                                aria-label="Toggle Genius Mode"
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>
                            <input
                                value={searchQuery}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setHideDropdown(false)}
                                placeholder={placeholder}
                                className="h-full w-full bg-transparent focus:outline-none placeholder:text-gray-500"
                            />
                        </div>
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
                                <ul className="max-h-64 overflow-y-auto">
                                    {suggestions.map((location, index) => (
                                        <li key={`${location.city}-${index}`}>
                                            <button
                                                onClick={() => handleSuggestionClick(location)}
                                                className={`w-full text-left px-4 py-2 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                                                    selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                                                    <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <div className="text-gray-900 font-medium text-sm">{location.city}</div>
                                                    <div className="text-xs text-gray-500">{location.country}</div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex items-stretch gap-3">
                        <div className="w-40">
                            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-full rounded-md bg-gray-50 border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                                <option>Any type</option>
                                <option>Apartment</option>
                                <option>Studio</option>
                                <option>House</option>
                                <option>Loft</option>
                            </select>
                        </div>
                        <div className="w-32">
                            <select value={more} onChange={(e) => setMore(e.target.value)} className="w-full h-full rounded-md bg-gray-50 border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                                <option>Any</option>
                                <option>1+</option>
                                <option>2+</option>
                                <option>3+</option>
                                <option>4+</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isGeniusSearching} className="h-10 px-6 rounded-md bg-[#062b3f] text-white text-sm font-medium shadow-sm flex items-center gap-2 hover:bg-[#083954] disabled:bg-opacity-70 disabled:cursor-not-allowed">
                            {isGeniusMode ? (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {isGeniusSearching ? 'Thinking...' : 'Genius Search'}
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75 19.5 19.5" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.25a6.75 6.75 0 1 1 13.5 0 6.75 6.75 0 0 1-13.5 0Z" />
                                    </svg>
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
