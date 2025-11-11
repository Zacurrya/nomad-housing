import Link from "next/link";
import AuthButton from "../user/AuthButton";
import FavouritesButton from "../ui/FavouritesButton";
import RegionSettingsButton from "../user/RegionSettingsButton";
import AddListingButton from "../ui/AddListingButton";
import ExploreButton from "../ui/ExploreButton";
import Image from "next/image";

export default function NavBar() {
	return (
        <div className="bg-foreground">
            <nav className="bg-foreground text-white w-full max-w-7xl mx-auto text-center pr-10 pl-5 py-3 flex items-center justify-between">
                <div className="flex flex-row items-center gap-2 text-sm">
                    <Link href="/" className="text-2xl font-semibold mr-3">
                        <Image className="outline-1 outline-white/30" src="/Logo.svg" alt="Nomad Housing Logo" width={70} height={70} />
                    </Link>
                    <div className="opacity-90">
                        {/* Explore Listings */}
                        <ExploreButton />
                        {/* Add Listing */}
                        <AddListingButton />
                    </div>
                </div>

                <div className="text-white flex text-sm opacity-90 items-center gap-2">
                    {/* Currency Settings */}
                    <RegionSettingsButton />
                    {/* Favorites */}
                    <FavouritesButton />
                    {/* Log in/Sign up Button */}
                    <AuthButton />
                </div>
            </nav>
        </div>
	);
}
