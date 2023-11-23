import { useEffect } from "react";
import Chapter from "./Chapter";

export default function ItemDetails(item) {
  useEffect(() => {
    console.log(item, "is the item");
  }, [item]);
  return (
    <div className="mt-5 p-5 rounded-md border ">
      <h2 className="text-[50px] font-medium">{item.item.title}</h2>
      {item && (
        <div>
          bookIcon{" "}
          <h2 className="text-[12px] text-gray-400">
            {item.item.chapterSection?.length}
            {" chapters"}
          </h2>
        </div>
      )}
      <h3>{item.item.description}</h3>
      <div className="mt-5">
        {item.item.chapterSection?.map((chapter) => (
          <Chapter key={chapter.id} content={chapter} />
        ))}
      </div>
    </div>
  );
}
