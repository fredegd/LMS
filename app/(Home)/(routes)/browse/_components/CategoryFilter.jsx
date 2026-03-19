"use client";

import { useState } from "react";

export default function CategoryFilter({ filters, selectedCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-1 gap-2 overflow-x-auto pb-1 scrollbar-none">
      {filters.map((filter, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={index}
            className={`
              shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all
              ${isActive
                ? "border-orange-300 bg-orange-50 text-orange-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
            onClick={() => {
              setActiveIndex(index);
              selectedCategory(filter);
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
