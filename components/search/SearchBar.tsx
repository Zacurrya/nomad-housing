"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

type LocationSuggestion = {
    city: string;
    country: string;
};

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [locations, setLocations] = useState<LocationSuggestion[]>([]);
    const [hideDropdown, setHideDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch all locations on mount
    useEffect(() => {
        fetch("/api/locations")
            .then((res) => res.json())
            .then((data) => {
                const locationList = data.map((loc: { city: string; country: string }) => ({
                    city: loc.city,
                    country: loc.country,
                }));
                setLocations(locationList);
            })
            .catch((err) => console.error("Failed to fetch locations:", err));
    }, []);

    // Filter suggestions based on search query using useMemo (case-insensitive)
    const suggestions = useMemo(() => {
        if (searchQuery.length < 2) {
            return [];
        }

        const searchLower = searchQuery.toLowerCase();
        const filtered = locations.filter((loc) =>
            loc.city.toLowerCase().includes(searchLower) ||
            loc.country.toLowerCase().includes(searchLower)
        );
        return filtered;
    }, [searchQuery, locations]);

    // Show dropdown when we have suggestions and not explicitly hidden
    const showSuggestions = suggestions.length > 0 && !hideDropdown;

    // Close dropdown when clicking outside
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

    const handleSuggestionClick = (location: LocationSuggestion) => {
        setSearchQuery(`${location.city}, ${location.country}`);
        setHideDropdown(true);
        router.push(`/search?city=${encodeURIComponent(location.city)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                // Select the highlighted suggestion
                handleSuggestionClick(suggestions[selectedIndex]);
            } else {
                // No suggestion selected, perform regular search
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setHideDropdown(true);
            setSelectedIndex(-1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setHideDropdown(false); // Show dropdown when typing
        setSelectedIndex(-1); // Reset selection when typing
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <h1 className="text-xl md:text-lg font-normal">Find your next home, anywhere</h1>
            <p className="mt-3 text-xl text-white/80">Discover furnished houses in the world&apos;s most exciting cities</p>

            <div className="mt-8 mb-3">
                <div className="relative max-w-3xl mx-auto" ref={dropdownRef}>
                    <div className={`relative bg-white shadow-xl p-1 border-4 border-white/20 ${showSuggestions ? 'rounded-t-3xl' : 'rounded-3xl'}`}>
                        <input
                            aria-label="search"
                            placeholder="Search by city, country, or region"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setHideDropdown(false)}
                            className="w-full rounded-3xl py-4 px-6 pr-36 text-gray-800 outline-none"
                        />
                        <button 
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground text-white px-4 py-2.5 rounded-full shadow-sm hover:bg-foreground/90 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white rounded-b-3xl shadow-xl border-4 border-t-0 border-white/20 overflow-hidden z-50">
                            {/* Separator line between search bar and dropdown */}
                            <div className="border-t border-gray-200" />
                            <ul className="max-h-64 overflow-y-auto">
                                {suggestions.map((location, index) => (
                                    <li key={`${location.city}-${index}`}>
                                        <button
                                            onClick={() => handleSuggestionClick(location)}
                                            className={`w-full text-left px-6 py-3 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                                                selectedIndex === index 
                                                    ? 'bg-gray-100' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-5 h-5 text-gray-400"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <div>
                                                <div className="text-gray-900 font-medium">
                                                    {location.city}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {location.country}
                                                </div>
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
