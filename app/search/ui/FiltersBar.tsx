"use client";
import { useState } from "react";
import { useCurrency } from "../../../components/context/CurrencyContext";
import { formatPrice } from "../../../lib/currency";
import SortMenu, { SortValue } from "./SortMenu";

export default function FiltersBar({ total, underActive, onToggleUnderAction, onSortChangeAction, onAllAction }: { total: number; underActive: boolean; onToggleUnderAction: () => void; onSortChangeAction?: (v: SortValue) => void; onAllAction?: () => void; }) {
  const { currency } = useCurrency();
  const thresholdLabel = formatPrice(1000, currency);
  const [sortValue, setSortValue] = useState<SortValue>(null);

  const handleSortChange = (v: SortValue) => {
    setSortValue(v);
    onSortChangeAction?.(v);
  };

  return (
    <div className="max-w-8xl mx-auto px-6 mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        <p className="font-medium">Available Properties</p>
        <p className="text-gray-500">{total} properties found</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="px-3 py-1 text-xs rounded-md border bg-white hover:bg-gray-50"
            onClick={() => {
              setSortValue(null);
              onAllAction?.();
            }}
          >
            All Properties
          </button>
          <button onClick={onToggleUnderAction} className={`px-3 py-1 text-xs rounded-md border bg-white hover:bg-gray-50 ${underActive ? 'border-[#0a2540] ring-1 ring-[#0a2540]' : ''}`}>
            Under {thresholdLabel}
          </button>
          <button className="px-3 py-1 text-xs rounded-md border bg-white hover:bg-gray-50">Furnished</button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SortMenu value={sortValue} onChangeAction={handleSortChange} />
        <button className="inline-flex items-center h-8 w-8 justify-center rounded-md border bg-white hover:bg-gray-50" aria-label="List view">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6 12h12m-9 5.25h6" />
          </svg>
        </button>
        <button className="inline-flex items-center h-8 w-8 justify-center rounded-md border bg-white hover:bg-gray-50" aria-label="Filter">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .53 1.28L15 11.06v6.69a.75.75 0 0 1-1.2.6l-3-2.25a.75.75 0 0 1-.3-.6v-4.44L3.22 5.78A.75.75 0 0 1 3 5.25Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
