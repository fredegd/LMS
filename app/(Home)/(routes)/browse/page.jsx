"use client";
import { useState, useEffect } from "react";
import CategoryFilter from "./_components/CategoryFilter";
// import { getList } from '@/app/_services'
import { getList } from "../../../_services/index";
import ItemList from "./_components/ItemList";

function Browse() {
  const [items, setItems] = useState();
  const [filters, setFilters] = useState();
  const [coursesOrg, setCoursesOrg] = useState([]);
  useEffect(() => {
    getList().then((res) => {
      setItems(res.snippetCollections);

      setCoursesOrg(res.snippetCollections);

      const tags = new Set();
      tags.add("all tags");
      res.snippetCollections.forEach((snippet) => {
        snippet.tags.forEach((tag) => {
          tags.add(tag);
        });
      });
      let uniqueTag = Array.from(tags);
      setFilters(uniqueTag);
    });
  }, []);

  const filterCourse = (category) => {
    if (category === "all tags") {
      setItems(coursesOrg);
      return;
    }
    const filtered = coursesOrg.filter((item) => {
      return item.tags.includes(category);
    });

    setItems(filtered);
  };

  return (
    <div>
      {filters ? (
        <CategoryFilter
          filters={filters}
          selectedCategory={(category) => filterCourse(category)}
        />
      ) : null}
      {items ? (
        <ItemList items={items} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h2>Loading...</h2>
        </div>
      )}
    </div>
  );
}

export default Browse;
