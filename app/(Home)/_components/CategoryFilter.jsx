"use client";
import { useState, useEffect } from "react";

export default function CategoryFilter() {
  const [activeIndex, setActiveIndex] = useState(0);
  const filterOptions = [
    {
      id: 1,
      name: "All",
      value: "all",
    },
    {
      id: 2,
      name: "React Js",
      value: "react",
    },
    {
      id: 3,
      name: "Node Js",
      value: "node",
    },
    {
      id: 4,
      name: "Firebase",
      value: "firebase",
    },
    {
      id: 5,
      name: "Tailwind Css",
      value: "tailwind",
    },
  ];
  return (
    <div className="flex flex-wrap gap-5">
      {filterOptions.map((item, index) => {
        return (
          <div key={index}>
            <button className={`border p-2 px-4 text-sm rounded-md hover:border-purple-800 hover:bg-gray-200 ${activeIndex==index?'bg-purple-50 text-purple-500':null}`}
            onClick={()=>setActiveIndex(index)}>
              <h2 htmlFor={item.id}>{item.name}</h2>
            </button>
          </div>
        );
      })}
    </div>
  );
}
