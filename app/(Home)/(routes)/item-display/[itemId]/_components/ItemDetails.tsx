import Chapter from "./Chapter";
import { Book } from "lucide-react";
import React from "react";
import { SnippetCollection } from "../../../../../../types/hygraph";

interface ItemDetailsProps {
  item: SnippetCollection;
}

export default function ItemDetails({ item }: ItemDetailsProps) {
  if (!item) return null;

  const chapters = item.chapterSection || [];

  return (
    <div>
      {/* Title + meta */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Book className="h-4 w-4" />
            {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
          </span>

          {item.tags?.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 text-xs font-medium text-orange-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {item.description && (
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {item.description}
          </p>
        )}
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <Chapter key={chapter.id} content={chapter} />
          ))}
        </div>
      )}
    </div>
  );
}
