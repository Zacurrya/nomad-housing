export default function SearchBar() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold">Find your next home, anywhere</h1>
            <p className="mt-3 text-sm text-white/80">Discover furnished rentals in the world's most exciting cities</p>

            <div className="mt-10">
                <div className="relative max-w-3xl mx-auto bg-white rounded-full shadow-xl p-1 border-4 border-white/20">
                    <input
                        aria-label="search"
                        placeholder="Search by city, country, or region"
                        className="w-full rounded-full py-4 px-6 pr-36 text-gray-800"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#062b3f] text-white px-4 py-2 rounded-full shadow-sm">
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}