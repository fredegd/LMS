"use client";

import { Search, X } from "lucide-react";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const initialQuery = searchParams?.get("search") || "";
  const [query, setQuery] = useState(initialQuery);

  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams || "");
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      
      // Handle navigation/parameters based on current page
      if (pathname === "/browse" || pathname === "/dashboard") {
        router.push(`${pathname}?${params.toString()}`);
      } else if (value) {
        // From other pages, redirect to /browse if there is a query
        router.push(`/browse?${params.toString()}`);
      }
    },
    [router, searchParams, pathname]
  );

  // Debounce the URL update
  useEffect(() => {
    const currentSearch = searchParams?.get("search") || "";
    const timer = setTimeout(() => {
      // Auto-update URL or redirect to /browse if query changed
      if (query !== currentSearch) {
        updateSearch(query);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, updateSearch, searchParams]);

  // Update local input if URL changes (external sync)
  useEffect(() => {
    const currentSearch = searchParams?.get("search") || "";
    setQuery(currentSearch);
  }, [searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      updateSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (pathname === "/browse") {
      updateSearch("");
    }
  };

  return (
    <div className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-1.5 text-sm text-gray-500 transition-colors focus-within:border-orange-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
      <Search className="h-4 w-4 shrink-0 text-gray-400" />
      <input
        type="text"
        placeholder="Search snippets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="p-1 hover:bg-gray-200/50 rounded-full transition-colors"
        >
          <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-1.5 text-sm text-gray-500">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="w-full h-4 animate-pulse bg-gray-200 rounded" />
      </div>
    }>
      <SearchBarInner />
    </Suspense>
  );
}
