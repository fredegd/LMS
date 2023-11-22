"use client";
import React, { useState, useEffect } from "react";

import { getItemById } from "../../../../_services/index";
import CoverPage from "./_components/CoverPage";
import ItemDetails from "./_components/ItemDetails";

export default function ItemPreview({ params }) {
  const [item, setItem] = useState({});
  useEffect(() => {
    params.itemId?getItem(params.itemId):null;
  }, []);

  const getItem = () => {
    getItemById(params.itemId).then((res) => {
      setItem(res.snippetCollection);
      console.log(res.snippetCollection, "is the item");
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {item ? (
          <div className="col-span-2">
            <CoverPage data={item.banner.url} />
            <ItemDetails item={item} />
          </div>
        ) : (
          <div className="col-span-2">Loading...</div>
        )}
        <div className="h-screen flex flex-col w-64 border shadow-sm ">
          enroll options
        </div>
      </div>
    </div>
  );
}
