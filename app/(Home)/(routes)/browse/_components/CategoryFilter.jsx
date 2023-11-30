"use client";
import { useState, useEffect } from "react";

export default function CategoryFilter({ filters, selectedCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const filterOptions = filters.map((item, index) => {
    return { id: index, name: item, value: item };
  });

  return (
    <div className="flex flex-wrap gap-5">
      {filterOptions.map((item, index) => {
        return (
          <div key={index}>
            <button
              className={`border p-2 px-4 text-sm rounded-md hover:border-orange-500 hover:bg-gray-150 ${
                activeIndex == index ? "bg-orange-50 text-orange-500" : null
              }`}
              onClick={() => {
                setActiveIndex(index);
                selectedCategory(item.value);
              }}
            >
              <h2 htmlFor={item.id}>{item.name}</h2>
            </button>
          </div>
        );
      })}
    </div>
  );
}
