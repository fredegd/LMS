"use client";
import React from "react";
import { Pencil, Trash2, Book } from "lucide-react";
import { SnippetPreview } from "../../../../../types/hygraph";

interface ContentTableProps {
  items: SnippetPreview[];
  onEdit: (item: SnippetPreview) => void;
  onDelete: (item: SnippetPreview) => void;
}

export default function ContentTable({ items, onEdit, onDelete }: ContentTableProps) {
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
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Tags</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Level</th>
            <th className="px-4 py-3 font-medium hidden lg:table-cell">Chapters</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
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
