import Link from "next/link";
import AuthButton from "../ui/AuthButton";
import FavouritesButton from "../ui/FavouritesButton";
import RegionSettingsButton from "../ui/RegionSettingsButton";
import SearchBar from "../ui/SearchBar";

export default function Header() {
	return (
		<header className="bg-[#0a2540] text-white">
			<nav className="max-w-6xl mx-10 py-2 flex items-center justify-between">
                <Link href="/" className="text-2xl font-semibold">
                    Nomad
                </Link>

				<div className="flex items-center gap-4 text-sm opacity-90">
                    {/* Currency Settings */}
                    <RegionSettingsButton />
                    {/* Favorites */}
                    <FavouritesButton />
                    {/* Log in/Sign up Button */}
                    <AuthButton />
				</div>
			</nav>
			{/* Hero / search area */}
            <SearchBar />

            {/* Trending header and controls (moved from homepage) */}
            <div className="max-w-6xl mx-auto px-6 pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Trending locations</h2>
                        <p className="text-sm text-white/80">Most popular destinations this month</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded">Trending</button>
                        <button className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded">Explore all</button>
                    </div>
                </div>
            </div>
		</header>
	);
}
