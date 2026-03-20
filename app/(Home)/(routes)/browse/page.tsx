"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import CategoryFilter from "./_components/CategoryFilter";
import { getList } from "../../../_services/index";
import ItemList from "./_components/ItemList";
import { SnippetPreview } from "../../../../types/hygraph";

function CardSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3">
        <div className="skeleton w-28 h-[4.5rem] shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-1/4 rounded mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="skeleton aspect-[16/9] w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-1/3 rounded mt-3" />
      </div>
    </div>
  );
}

function BrowseSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "mt-5 flex flex-col gap-3"
      }
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}

function Browse() {
  const [items, setItems] = useState<SnippetPreview[]>([]);
  const [filters, setFilters] = useState<string[]>(["all tags"]);
  const [itemsOriginal, setItemsOriginal] = useState<SnippetPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";

  useEffect(() => {
    setIsMounted(true);
    const savedMode = localStorage.getItem("browseViewMode") as "grid" | "list";
    if (savedMode && (savedMode === "grid" || savedMode === "list")) {
      setViewMode(savedMode);
    }
  }, []);

  const updateViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("browseViewMode", mode);
  };

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      setIsLoading(true);
      setError("");

      const response = await getList(searchQuery);
      const snippetCollections = response?.snippetCollections || [];

      if (!active) return;

      setItems(snippetCollections);
      setItemsOriginal(snippetCollections);

      const tags = new Set<string>(["all tags"]);
      snippetCollections.forEach((snippet) => {
        (snippet.tags || []).forEach((tag) => {
          if (tag) tags.add(tag);
        });
      });

      setFilters(Array.from(tags));
      setIsLoading(false);
    };

    loadItems().catch((requestError) => {
      console.error("Failed to load snippet items.", requestError);
      if (!active) return;

      setError("Could not load snippets right now.");
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [searchQuery]);

  const filterItems = (category: string) => {
    if (category === "all tags") {
      setItems(itemsOriginal);
      return;
    }

    const filtered = itemsOriginal.filter((item) => {
      return (item.tags || []).includes(category);
    });

    setItems(filtered);
  };

  const sortedItems = useMemo(() => {
    const sortable = [...items];
    sortable.sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
    return sortable;
  }, [items, sortBy]);

  return (
    <div>
      {/* Top bar: filters + view toggle */}
      <div className="flex items-center justify-between gap-3">
        <CategoryFilter
          filters={filters}
          selectedCategory={(category) => filterItems(category)}
        />
        <div className="flex items-center gap-2">
          {/* Sort Select */}
          <div className="relative flex items-center shrink-0">
            <ArrowUpDown
              size={14}
              className="absolute left-2.5 text-gray-400 pointer-events-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-8 pr-8 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer hover:border-gray-300"
            >
              <option value="newest">Recently added</option>
              <option value="oldest">Oldest added</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
            <div className="absolute right-2.5 pointer-events-none">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex gap-0.5 shrink-0 rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              onClick={() => updateViewMode("grid")}
              title="Grid view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => updateViewMode("list")}
              title="List view"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      {!isMounted ? (
        <BrowseSkeleton viewMode={viewMode} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500">
          <p>{error}</p>
        </div>
      ) : isLoading ? (
        <BrowseSkeleton viewMode={viewMode} />
      ) : sortedItems.length ? (
        <ItemList items={sortedItems} viewMode={viewMode} />
      ) : (
        <div className="flex flex-col items-center justify-center h-60 text-gray-400">
          <p>No snippets available.</p>
        </div>
      )}
    </div>
  );
}

export default Browse;
