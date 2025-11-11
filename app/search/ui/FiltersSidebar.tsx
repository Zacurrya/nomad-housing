"use client";
import { useState, useEffect } from "react";
import { useCurrency } from "../../../components/context/CurrencyContext";
import { convertFromUSD, type Currency } from "../../../lib/currency";
import * as flags from 'country-flag-icons/react/3x2';

export interface SidebarFilters {
  priceMin: number; // USD base
  priceMax: number; // USD base
  minBeds: number;
  countries: string[];
  amenities?: string[];
}

interface FiltersSidebarProps {
  filters: SidebarFilters;
  onChangeAction: (f: SidebarFilters) => void;
  allCountries: string[]; // available countries extracted from dataset
  currency: string; // pass for display only
  minUSD: number; // dataset min price in USD
  maxUSD: number; // dataset max price in USD
}

export default function FiltersSidebar({ filters, onChangeAction, allCountries, currency, minUSD, maxUSD }: FiltersSidebarProps) {
  const { priceMin, priceMax, minBeds, countries } = filters;
  const { currency: ctxCurrency } = useCurrency();
  const displayCurrency = currency || ctxCurrency;

  // Local slider state in USD base values - initialize to dataset bounds if unset
  const [localMin, setLocalMin] = useState(() => priceMin || minUSD);
  const [localMax, setLocalMax] = useState(() => priceMax || maxUSD);
  const [localBeds, setLocalBeds] = useState(minBeds);
  const [localCountries, setLocalCountries] = useState<string[]>(countries);
  const [localAmenities, setLocalAmenities] = useState<string[]>(filters.amenities ?? []);

  // Push changes upstream whenever local states change
  useEffect(() => {
    onChangeAction({ priceMin: localMin, priceMax: localMax, minBeds: localBeds, countries: localCountries, amenities: localAmenities });
  }, [localMin, localMax, localBeds, localCountries, localAmenities, onChangeAction]);

  const handleCountryToggle = (c: string) => {
    setLocalCountries((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const handleAmenityToggle = (a: string) => {
    setLocalAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  // For display convert USD base to selected currency but keep slider logic in USD
  const convertedMin = convertFromUSD(localMin, displayCurrency as Currency);
  const convertedMax = convertFromUSD(localMax, displayCurrency as Currency);

  const denom = Math.max(1, maxUSD - minUSD);
  const step = Math.max(10, Math.round(denom / 200));

  return (
  <aside className="w-60 shrink-0 border-r bg-white/70 backdrop-blur-sm pr-4 py-6 rounded-lg h-full">
      <h2 className="text-sm font-semibold mb-4">Filters</h2>

      {/* Price Range */}
      <div className="mb-6">
        <p className="text-xs font-medium mb-2">Price Range ({displayCurrency})</p>
        <div className="flex justify-between text-[11px] text-gray-600 mb-1">
          <span>{convertedMin.toLocaleString()}</span>
          <span>{convertedMax.toLocaleString()}</span>
        </div>
        {/* Dual-thumb slider (two overlapped inputs) */}
  <div className="relative h-6" style={{ ['--thumb-half' as unknown as string]: '14px' } as React.CSSProperties}>
          {/* track */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded bg-gray-200" />
          {/* filled range */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#0a2540] rounded"
            style={{
              left: `calc(${((localMin - minUSD) / denom) * 100}% + var(--thumb-half))`,
              right: `calc(${100 - ((localMax - minUSD) / denom) * 100}% + var(--thumb-half))`,
            }}
          />
          <input
            type="range"
            min={minUSD}
            max={maxUSD}
            step={step}
            value={localMin}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v <= localMax) setLocalMin(v);
            }}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto"
          />
          <input
            type="range"
            min={minUSD}
            max={maxUSD}
            step={step}
            value={localMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= localMin) setLocalMax(v);
            }}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <p className="text-xs font-medium mb-2">Minimum Bedrooms</p>
        <input
          type="number"
          min={0}
          value={localBeds}
          onChange={(e) => setLocalBeds(Number(e.target.value) || 0)}
          className="w-full rounded-md border px-2 py-1 text-xs"
        />
      </div>

      {/* Countries */}
      <div className="mb-4">
        <p className="text-xs font-medium mb-2">Countries</p>
        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
          {allCountries.map((c) => {
            const active = localCountries.includes(c);
            const FlagComponent = getCountryFlag(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleCountryToggle(c)}
                className={`w-full text-left text-xs px-2 py-1 rounded-md border ${active ? "bg-[#0a2540] text-white border-[#0a2540]" : "bg-white hover:bg-gray-50"}`}
              >
                {FlagComponent && <FlagComponent className="inline-block w-4 h-3 mr-2 rounded-[0.15rem]" />}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-medium mb-2">Amenities</p>
        <div className="space-y-1">
          {DEFAULT_AMENITIES.map((a) => {
            const active = localAmenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => handleAmenityToggle(a)}
                className={`w-full text-left text-xs px-2 py-1 rounded-md border ${active ? "bg-[#0a2540] text-white border-[#0a2540]" : "bg-white hover:bg-gray-50"}`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

const DEFAULT_AMENITIES = [
  "Shared gym",
  "Shared pool",
  "Furnished",
  "Washer/Dryer",
  "Air conditioning",
] as const;

function getCountryFlag(country: string) {
  const flagMap: Record<string, React.ComponentType<{ className?: string }> | undefined> = {
    "United Kingdom": flags.GB,
    "Spain": flags.ES,
    "United Arab Emirates": flags.AE,
    "Thailand": flags.TH,
    "Vietnam": flags.VN,
    "Japan": flags.JP,
    "Colombia": flags.CO,
    "Portugal": flags.PT,
    "Germany": flags.DE,
    "United States": flags.US,
    "Netherlands": flags.NL,
  };
  return flagMap[country] || null;
}
