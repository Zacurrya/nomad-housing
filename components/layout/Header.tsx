import SearchBar from "../search/SearchBar";

export default function Header() {
	return (
        <header className="bg-linear-to-b from-foreground via-foreground to-foreground/95 text-white">
            {/* Search Area */}
            <SearchBar />
            {/* Trending header and controls  */}
            <div className="max-w-7xl mx-auto px-5 pb-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl mb-1 font-semibold">Trending locations</h2>
                        <p className="text-md text-white/60">Most popular destinations this month</p>
                    </div>
                </div>
            </div>
        </header>
	);
}
