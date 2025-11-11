import SearchBar from "../../components/search/SearchBar";

export default function Header() {
	return (
        <header className="bg-linear-to-b from-foreground via-foreground to-foreground/95 text-white">
            {/* Search Area */}
            <SearchBar />
        </header>
	);
}
