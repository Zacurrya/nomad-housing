"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchBar() {
    const searchParams = useSearchParams();
    const cityParam = searchParams.get('city');
    
    // Initialize query with city param or empty string
    const initialQuery = useMemo(() => cityParam || "", [cityParam]);
    const [query, setQuery] = useState(initialQuery);
    const [type, setType] = useState("Any type");
    const [more, setMore] = useState("Any");

    return (
        <div className="flex flex-row w-full bg-white justify-between shadow-stone-400 shadow-sm mx-auto px-6 py-6">
            <div className="w-full max-w-7xl mx-auto text-center items-center">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // TODO: hook into search action or router push
                    }}
                    className="flex w-full items-stretch justify-between gap-3"
                >
                    {/* Left: Location input (grows) */}  
                    <div className="flex-1 min-w-0">
                        <div className="h-10 flex items-center rounded-md bg-gray-50 border border-gray-200 px-4 text-sm text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.5-4.5 7.5-8.353 7.5-11.25A7.5 7.5 0 1 0 4.5 9.75C4.5 12.647 7.5 16.5 12 21Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                            </svg>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by city or location"
                                className="h-full w-full bg-transparent focus:outline-none placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Right: Controls cluster */}
                    <div className="flex items-stretch gap-3">
                        {/* Type select */}
                        <div className="w-40">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full h-full rounded-md bg-gray-50 border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none"
                            >
                                <option>Any type</option>
                                <option>Apartment</option>
                                <option>Studio</option>
                                <option>House</option>
                                <option>Loft</option>
                            </select>
                        </div>
                        {/* More select (placeholder for beds etc) */}
                        <div className="w-32">
                            <select
                                value={more}
                                onChange={(e) => setMore(e.target.value)}
                                className="w-full h-full rounded-md bg-gray-50 border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none"
                            >
                                <option>Any</option>
                                <option>1+</option>
                                <option>2+</option>
                                <option>3+</option>
                                <option>4+</option>
                            </select>
                        </div>
                        {/* Submit */}
                        <button
                            type="submit"
                            className="h-10 px-6 rounded-md bg-[#062b3f] text-white text-sm font-medium shadow-sm flex items-center gap-2 hover:bg-[#083954]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75 19.5 19.5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.25a6.75 6.75 0 1 1 13.5 0 6.75 6.75 0 0 1-13.5 0Z" />
                            </svg>
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}