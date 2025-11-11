"use client";
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import FiltersBar from "./ui/FiltersBar";
import PropertyCard, { type Property } from "../../components/cards/PropertyCard";
import { useCurrency } from "../../components/context/CurrencyContext";
import { useAuthUI } from "../../components/context/AuthUIContext";
import { parseUSD, convertFromUSD } from "../../lib/currency";
import SearchBar from "../../components/ui/ListingSearchBar";
import FiltersSidebar, { type SidebarFilters } from "./ui/FiltersSidebar";

export default function SearchPage() { 
  const { currency } = useCurrency();
  const { userId } = useAuthUI();
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');
  const [underActive, setUnderActive] = useState(false);
  type SortValue = "price-asc" | "price-desc" | "featured-top" | null;
  const [sort, setSort] = useState<SortValue>("featured-top");
  const [properties, setProperties] = useState<Property[]>([]);

  // Fetch listings from API
  useEffect(() => {
    let mounted = true;
    let url = cityParam ? `/api/listings?city=${encodeURIComponent(cityParam)}` : "/api/listings";
    if (userId) {
      url += (url.includes('?') ? '&' : '?') + `userId=${userId}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((data: Property[]) => {
        if (mounted) setProperties(data);
      })
      .catch((e) => console.error("Failed to load listings", e));
    return () => {
      mounted = false;
    };
  }, [cityParam, userId]);
  // Dataset-wide USD price bounds for dynamic slider range
  const datasetMinUSD = useMemo(() => {
    if (properties.length === 0) return 0;
    return properties.reduce((min, p) => {
      const v = parseUSD(p.price);
      return v < min ? v : min;
    }, Number.POSITIVE_INFINITY);
  }, [properties]);
  const datasetMaxUSD = useMemo(() => {
    if (properties.length === 0) return 0;
    return properties.reduce((max, p) => {
      const v = parseUSD(p.price);
      return v > max ? v : max;
    }, 0);
  }, [properties]);
  const [filters, setFilters] = useState<SidebarFilters>({
    priceMin: 0,
    priceMax: 0,
    minBeds: 0,
    countries: [],
    amenities: [],
  });
  // Derived effective filters that fall back to dataset bounds when unset
  const effectiveFilters: SidebarFilters = useMemo(() => ({
    priceMin: filters.priceMin || datasetMinUSD,
    priceMax: filters.priceMax || datasetMaxUSD,
    minBeds: filters.minBeds,
    countries: filters.countries,
    amenities: filters.amenities,
  }), [filters, datasetMinUSD, datasetMaxUSD]);
  const allCountries = useMemo(() => Array.from(new Set(properties.map((p) => p.country))).sort(), [properties]);

  const filtered = useMemo(() => {
    let arr = properties;
    // Under 1,000 in current currency
    if (underActive) {
      arr = arr.filter((p) => convertFromUSD(parseUSD(p.price), currency) < 1000);
    }
    // Price range in USD
    arr = arr.filter((p) => {
      const usd = parseUSD(p.price);
      return usd >= effectiveFilters.priceMin && usd <= effectiveFilters.priceMax;
    });
    // Min bedrooms
    if (effectiveFilters.minBeds > 0) {
      arr = arr.filter((p) => p.beds >= effectiveFilters.minBeds);
    }
    // Countries
    if (effectiveFilters.countries.length > 0) {
      const set = new Set(effectiveFilters.countries);
      arr = arr.filter((p) => set.has(p.country));
    }
    // Amenities: require all selected amenities to be present (AND logic)
    if (effectiveFilters.amenities && effectiveFilters.amenities.length > 0) {
      const set = new Set(effectiveFilters.amenities);
      arr = arr.filter((p) => {
        const a = new Set(p.amenities ?? []);
        for (const need of set) {
          if (!a.has(need)) return false;
        }
        return true;
      });
    }
    return arr;
  }, [underActive, currency, effectiveFilters, properties]);
 

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") {
      arr.sort((a, b) => parseUSD(a.price) - parseUSD(b.price));
    } else if (sort === "price-desc") {
      arr.sort((a, b) => parseUSD(b.price) - parseUSD(a.price));
    } else if (sort === "featured-top") {
      arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return arr;
  }, [filtered, sort]);

  return (
    <>
      <Head>
        <title>Search for Rentals & Properties Globally | Nomad</title>
      </Head>
      <main>
        <SearchBar />
        <FiltersBar
          total={filtered.length}
          underActive={underActive}
          onToggleUnderAction={() => setUnderActive((v) => !v)}
          onSortChangeAction={(v) => setSort(v)}
          onAllAction={() => {
            setUnderActive(false); // clear under-1000 filter
            setSort("featured-top"); // put featured to the top
          }}
        />
        <section className="max-w-8xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <FiltersSidebar
                key={`${datasetMinUSD}-${datasetMaxUSD}`}
                filters={filters}
                onChangeAction={setFilters}
                allCountries={allCountries}
                currency={currency}
                minUSD={datasetMinUSD}
                maxUSD={datasetMaxUSD}
              />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              {sorted.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                  No properties of this kind
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sorted.map((p) => (
                    <PropertyCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
    </main>
    </>
  );
}
