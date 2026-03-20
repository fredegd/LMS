import Image from "next/image";
import Link from "next/link";
import { Book } from "lucide-react";
import React from "react";
import { SnippetPreview } from "../../../../../types/hygraph";

interface ItemListProps {
  items: SnippetPreview[];
  viewMode?: "grid" | "list";
}

export default function ItemList({ items, viewMode = "grid" }: ItemListProps) {
  const isGrid = viewMode === "grid";

  return (
    <div
      className={
        isGrid
          ? "mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "mt-5 flex flex-col gap-3"
      }
    >
      {items.map((item) => {
        const linkTo = `/item-display/${item.id}`;
        // Note: chapterSection might not be in SnippetPreview, check if it exists
        const chapterCount = (item as any).chapterSection?.length ?? 0;

        return (
          <Link href={linkTo} key={item.id} className="group">
            {isGrid ? (
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-md hover:border-gray-300">
                <div className="relative w-full aspect-[16/9] bg-gray-100">
                  {item.banner?.url ? (
                    <Image
                      src={item.banner.url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-300">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Book className="h-3.5 w-3.5" />
                      {chapterCount}
                    </span>
                    {item.tags?.slice(0, 2).map((tag, i) => (
                      <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {tag}
                      </span>
                    ))}
                    {(item.tags?.length ?? 0) > 2 && (
                      <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:shadow-sm hover:border-gray-300">
                <div className="w-28 h-[4.5rem] shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {item.banner?.url ? (
                    <Image
                      src={item.banner.url}
                      alt={item.title}
                      width={112}
                      height={72}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-300">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Book className="h-3 w-3" />
                      {chapterCount} ch.
                    </span>
                    {item.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
