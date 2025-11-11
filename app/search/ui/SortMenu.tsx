"use client";
import { useEffect, useRef, useState } from "react";

export type SortValue = "price-asc" | "price-desc" | null;

export default function SortMenu({ value, onChangeAction }: { value: SortValue; onChangeAction: (v: SortValue) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const el = ref.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [open]);

  const handleSelect = (v: Exclude<SortValue, null>) => {
    onChangeAction(v);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="px-3 py-1 text-xs rounded-md border bg-white hover:bg-gray-50 inline-flex items-center gap-1"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
      >
        Sort
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.148l3.71-3.918a.75.75 0 1 1 1.08 1.04l-4.24 4.47a.75.75 0 0 1-1.08 0L5.25 8.27a.75.75 0 0 1-.02-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md z-50 py-1">
          <button
            type="button"
            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${value === "price-asc" ? "bg-gray-50" : ""}`}
            onClick={() => handleSelect("price-asc")}
          >
            Price: low to high
          </button>
          <button
            type="button"
            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${value === "price-desc" ? "bg-gray-50" : ""}`}
            onClick={() => handleSelect("price-desc")}
          >
            Price: high to low
          </button>
        </div>
      )}
    </div>
  );
}
