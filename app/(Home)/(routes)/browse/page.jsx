"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import CategoryFilter from "./_components/CategoryFilter";
import { getList } from "../../../_services/index";
import ItemList from "./_components/ItemList";

function CardSkeleton() {
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

function BrowseSkeleton() {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function Browse() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(["all tags"]);
  const [itemsOriginal, setItemsOriginal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      setIsLoading(true);
      setError("");

      const response = await getList();
      const snippetCollections = response?.snippetCollections || [];

      if (!active) return;

      setItems(snippetCollections);
      setItemsOriginal(snippetCollections);

      const tags = new Set(["all tags"]);
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
  }, []);

  const filterItems = (category) => {
    if (category === "all tags") {
      setItems(itemsOriginal);
      return;
    }

    const filtered = itemsOriginal.filter((item) => {
      return (item.tags || []).includes(category);
    });

    setItems(filtered);
  };

  return (
    <div>
      {/* Top bar: filters + view toggle */}
      <div className="flex items-center justify-between gap-3">
        <CategoryFilter
          filters={filters}
          selectedCategory={(category) => filterItems(category)}
        />
        <div className="flex gap-0.5 shrink-0 rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            onClick={() => setViewMode("grid")}
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
            onClick={() => setViewMode("list")}
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

      {/* Content area */}
      {error ? (
        <div className="flex flex-col items-center justify-center h-60 text-gray-500">
          <p>{error}</p>
        </div>
      ) : isLoading ? (
        <BrowseSkeleton />
      ) : items.length ? (
        <ItemList items={items} viewMode={viewMode} />
      ) : (
        <div className="flex flex-col items-center justify-center h-60 text-gray-400">
          <p>No snippets available.</p>
        </div>
      )}
    </div>
  );
}

export default Browse;
