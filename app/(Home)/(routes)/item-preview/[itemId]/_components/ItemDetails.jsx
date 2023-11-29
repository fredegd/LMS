import { useEffect } from "react";
import Chapter from "./Chapter";
import { Book } from "lucide-react";

export default function ItemDetails(item) {
  useEffect(() => {
    console.log(item, "is the item");
  }, [item]);
  return (
    <div className="mt-5 p-5 rounded-md border ">
      {item && (
        <>
          <div>
            <h2 className="text-[50px] font-medium">{item.item.title}</h2>
            <div className="flex items-center my-5">
              <h2 className="text-[15px] text-black">
                <Book className="h-4 w-4" />
              </h2>

              <h2 className="text-[15px] text-gray-400 mx-2">
                {item.item.chapterSection?.length}
                {"  chapters"}
              </h2>
              {item?.item?.tags?.map((tag, index) => (
                <h2 key={index} className="text-[15px] text-orange-400 mx-2">
                  {tag}
                </h2>
              ))}
            </div>
            <h3>{item.item.description}</h3>
          </div>
          <div className="mt-5">
            {item.item.chapterSection?.map((chapter) => (
              <Chapter key={chapter.id} content={chapter} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
