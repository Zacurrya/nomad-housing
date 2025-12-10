"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FiltersBar from "./ui/FiltersBar";
import PropertyCard, { type Property } from "../../components/cards/PropertyCard";
import { useCurrency } from "../../components/context/CurrencyContext";
import { useAuthUI } from "../../components/context/AuthUIContext";
import { convertFromUSD, parseUSD } from "../../lib/currency";

import FiltersSidebar, { type SidebarFilters } from "./ui/FiltersSidebar";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

type Props = {
  initialProperties: Property[];
};

export default function ClientSearch({ initialProperties }: Props) {
  const { currency } = useCurrency();
  const { userId } = useAuthUI();
  const searchParams = useSearchParams();
  // Parse search params once into a string and read from a local URLSearchParams
  // instance to avoid new-array identities from `searchParams.getAll` on every render.
  const searchParamsString = searchParams.toString();
  const parsedParams = new URLSearchParams(searchParamsString);
  const citiesParam = parsedParams.getAll('cities');
  const countriesParam = parsedParams.getAll('countries');
  const minPriceParam = parsedParams.get('minPrice');
  const maxPriceParam = parsedParams.get('maxPrice');
  const bedroomsParam = parsedParams.get('bedrooms');
  const amenitiesParam = parsedParams.getAll('amenities');
  const locationKeywordsParam = parsedParams.getAll('locationKeywords');
  const isGeniusSearch = parsedParams.get('geniusSearch') === 'true';

  const citiesKey = citiesParam.join('|');

  const [underActive, setUnderActive] = useState(false);
  type SortValue = "price-asc" | "price-desc" | "featured-top" | null;
  const [sort, setSort] = useState<SortValue>("featured-top");
  const [properties, setProperties] = useState<Property[]>(initialProperties || []);
  const [isLoading, setIsLoading] = useState(initialProperties.length === 0);
  const [filtersReady, setFiltersReady] = useState(!isGeniusSearch);

  useEffect(() => {
    if (!filtersReady) return;
    let mounted = true;

    const doFetch = async () => {
      try {
        setIsLoading(true);
        let url = "/api/listings";
        const urlParams = new URLSearchParams();
        const cities = citiesKey ? citiesKey.split('|') : [];
        if (cities.length > 0) {
          // Append as `city` param(s) — the API accepts `city` or `cities`.
          cities.forEach(city => urlParams.append('city', city));
        }
        if (userId) urlParams.append('userId', userId);
        const queryString = urlParams.toString();
        if (queryString) url += `?${queryString}`;

        const r = await fetch(url, { credentials: 'same-origin' });
        if (!mounted) return;

        const ct = r.headers.get('content-type') || '';
        if (!r.ok) {
          const body = await r.text().catch(() => '');
          console.error(`Listings fetch failed: ${r.status} ${r.statusText}`, body);
          setIsLoading(false);
          return;
        }

        if (!ct.includes('application/json')) {
          const text = await r.text().catch(() => '');
          console.error('Listings fetch returned non-json response', ct, text.slice(0, 1000));
          setIsLoading(false);
          return;
        }

        const data = await r.json();
        if (mounted) {
          setProperties(data as Property[]);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to load listings", e);
        setIsLoading(false);
      }
    };

    doFetch();
    return () => { mounted = false; };
  // Use a joined string as dependency so changing array identity doesn't retrigger.
  }, [citiesKey, userId, filtersReady]);

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
    priceMin: minPriceParam ? parseFloat(minPriceParam) : 0,
    priceMax: maxPriceParam ? parseFloat(maxPriceParam) : 0,
    bedrooms: bedroomsParam ? parseInt(bedroomsParam) : 0,
    countries: countriesParam.length > 0 ? countriesParam : [],
    amenities: amenitiesParam.length > 0 ? amenitiesParam : [],
    showSold: false,
  });

  useEffect(() => {
    if (isGeniusSearch && !filtersReady) {
      const timer = setTimeout(() => setFiltersReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isGeniusSearch, filtersReady]);

  const effectiveFilters: SidebarFilters = useMemo(() => ({
    priceMin: filters.priceMin || datasetMinUSD,
    priceMax: filters.priceMax || datasetMaxUSD,
    bedrooms: filters.bedrooms,
    countries: filters.countries,
    amenities: filters.amenities,
    showSold: filters.showSold,
  }), [filters, datasetMinUSD, datasetMaxUSD]);

  const allCountries = useMemo(() => Array.from(new Set(properties.map((p) => p.country))).sort(), [properties]);

  const filtered = useMemo(() => {
    let arr = properties;
    if (!effectiveFilters.showSold) {
      arr = arr.filter((p) => !p.sold);
    }
    if (underActive) {
      arr = arr.filter((p) => convertFromUSD(parseUSD(p.price), currency) < 1000);
    }
    arr = arr.filter((p) => {
      const usd = parseUSD(p.price);
      return usd >= effectiveFilters.priceMin && usd <= effectiveFilters.priceMax;
    });
    if (effectiveFilters.bedrooms > 0) {
      arr = arr.filter((p) => p.beds >= effectiveFilters.bedrooms);
    }
    if (effectiveFilters.countries.length > 0) {
      const set = new Set(effectiveFilters.countries);
      arr = arr.filter((p) => set.has(p.country));
    }
    if (effectiveFilters.amenities && effectiveFilters.amenities.length > 0) {
      const set = new Set(effectiveFilters.amenities);
      arr = arr.filter((p) => {
        const a = new Set(p.amenities ?? []);
        for (const need of set) { if (!a.has(need)) return false; }
        return true;
      });
    }
    // City keyword filtering: match city name substring
    if (locationKeywordsParam.length > 0) {
      arr = arr.filter((p) => {
        const cityText = p.city.toLowerCase();
        return locationKeywordsParam.some(keyword => cityText.includes(keyword.toLowerCase()));
      });
    }
    return arr;
  }, [underActive, currency, effectiveFilters, properties, locationKeywordsParam]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") arr.sort((a, b) => parseUSD(a.price) - parseUSD(b.price));
    else if (sort === "price-desc") arr.sort((a, b) => parseUSD(b.price) - parseUSD(a.price));
    else if (sort === "featured-top") arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return arr;
  }, [filtered, sort]);

  return (
    <div className="flex gap-6">
      <FiltersSidebar filters={filters} onChangeAction={setFilters} allCountries={allCountries} currency={currency} minUSD={datasetMinUSD} maxUSD={datasetMaxUSD} />
      <div className="flex-1">
        <FiltersBar
          total={sorted.length}
          underActive={underActive}
          onToggleUnderAction={() => setUnderActive((prev) => !prev)}
          onSortChangeAction={setSort}
        />
        <div className="grid grid-cols-3 gap-6 mt-6">
          {isLoading ? <LoadingSpinner /> : sorted.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}
