"use client";
import React, { useState, useEffect } from "react";

import { getItemById } from "../../../../_services/index";
import CoverPage from "./_components/CoverPage";
import ItemDetails from "./_components/ItemDetails";
import EnrollOptions from "./_components/EnrollOptions";

export default function ItemPreview({ params }) {
  const [item, setItem] = useState({});
  useEffect(() => {
    getItemById(params.itemId).then((res) => {
      setItem(res.snippetCollection);
      console.log(res.snippetCollection, "is the item");
    });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4">
        {item ? (
          <div className="col-span-3 ">
            <CoverPage data={item} />
            <ItemDetails item={item} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <h2>Loading...</h2>
          </div>
        )}
        <div className="col-span-3 xl:col-span-1">

        <EnrollOptions />
        </div>
      </div>
    </div>
  );
}
