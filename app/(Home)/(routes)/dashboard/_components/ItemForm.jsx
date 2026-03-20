"use client";
import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import BannerUpload from "./BannerUpload";

const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"];

export default function ItemForm({ initialData, onSave, onCancel, isSaving }) {
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setTagsInput((initialData.tags || []).join(", "));
      setLevel(initialData.level || "");
    } else {
      setTitle("");
      setDescription("");
      setTagsInput("");
      setLevel("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title,
      description,
      tags,
      level: level || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Item" : "New Item"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          placeholder="e.g. React Hooks Cheatsheet"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-y"
          placeholder="A short description of this snippet collection"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags <span className="text-gray-400 text-xs">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          placeholder="react, hooks, javascript"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Level
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          <option value="">— none —</option>
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Banner upload — edit mode only */}
      {isEdit && (
        <BannerUpload
          currentUrl={initialData?.banner?.url || null}
          linkEndpoint={`/api/content/${initialData.id}/banner`}
          onUploaded={(assetId, url) => {
            // Update is handled by the BannerUpload component via the link endpoint
          }}
          disabled={isSaving}
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !title.trim()}
          className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
