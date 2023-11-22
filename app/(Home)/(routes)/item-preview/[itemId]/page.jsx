"use client";
import React, { useState, useEffect } from "react";

import { getItemById } from "../../../../_services/index";
import CoverPage from "./_components/CoverPage";
import ItemDetails from "./_components/ItemDetails";
import EnrollOptions from "./_components/EnrollOptions";

export default function ItemPreview({ params }) {
  const [item, setItem] = useState({});
  useEffect(() => {
    params.itemId ? getItem(params.itemId) : null;
  }, []);

  const getItem = () => {
    getItemById(params.itemId).then((res) => {
      setItem(res.snippetCollection);
      console.log(res.snippetCollection, "is the item");
    });
  };

  return item ? (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-2">
          <CoverPage data={item} />
          <ItemDetails item={item} />
        </div>
       <EnrollOptions/>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <h2>Loading...</h2>
    </div>
  );
}
