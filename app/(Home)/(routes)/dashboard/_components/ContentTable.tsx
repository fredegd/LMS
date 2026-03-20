"use client";
import React, { useState, useMemo } from "react";
import { Pencil, Trash2, Book, ChevronUp, ChevronDown } from "lucide-react";
import { SnippetPreview } from "../../../../../types/hygraph";

interface ContentTableProps {
  items: SnippetPreview[];
  onEdit: (item: SnippetPreview) => void;
  onDelete: (item: SnippetPreview) => void;
}

type SortKey = "title" | "level" | "chapters";
type SortOrder = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortOrder;
}

export default function ContentTable({
  items,
  onEdit,
  onDelete,
}: ContentTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "title",
    direction: "asc",
  });

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    sortableItems.sort((a, b) => {
      let aValue: any = "";
      let bValue: any = "";

      if (sortConfig.key === "chapters") {
        aValue = a.chapterSection?.length ?? 0;
        bValue = b.chapterSection?.length ?? 0;
      } else {
        const key = sortConfig.key as keyof SnippetPreview;
        aValue = a[key] || "";
        bValue = b[key] || "";
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortOrder = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-gray-400">
        <Book className="h-10 w-10 mb-3" />
        <p>No content items yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-gray-600">
            <th
              className="px-4 py-3 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort("title")}
            >
              <div className="flex items-center gap-1">
                Title {getSortIcon("title")}
              </div>
            </th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Tags</th>
            <th
              className="px-4 py-3 font-medium hidden md:table-cell cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort("level")}
            >
              <div className="flex items-center gap-1">
                Level {getSortIcon("level")}
              </div>
            </th>
            <th
              className="px-4 py-3 font-medium hidden lg:table-cell cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => requestSort("chapters")}
            >
              <div className="flex items-center gap-1">
                Chapters {getSortIcon("chapters")}
              </div>
            </th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-b-0 hover:bg-orange-50/40 transition-colors"
            >
              <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                {item.title}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div className="flex flex-wrap gap-1">
                  {(item.tags || []).slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {(item.tags || []).length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 capitalize hidden md:table-cell text-gray-500">
                {item.level || "—"}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                {item.chapterSection?.length ?? 0}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
