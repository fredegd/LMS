"use client";
import { useState, useEffect } from "react";
import CategoryFilter from "./_components/CategoryFilter";
// import { getList } from '@/app/_services'
import { getList } from "../../../_services/index";
import ItemList from "./_components/ItemList";

function Browse() {
  const [items, setItems] = useState();
  useEffect(() => {
    getList().then((res) => {
      setItems(res.snippets);
      console.log(res.snippets, "is the response");
    });
  }, []);

  return (
    <div >
      <CategoryFilter />
      {items ? <ItemList items={items} /> : null}
    </div>
  );
}

export default Browse;