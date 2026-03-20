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
      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="space-y-6">
          {chapters.map((chapter) => (
            <Chapter key={chapter.id} content={chapter} />
          ))}
        </div>
      )}
    </div>
  );
}
