"use client";
import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import BannerUpload from "./BannerUpload";
import { SnippetCollection } from "../../../../../types/hygraph";

const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"];
const TAG_OPTIONS = ["Angular", "animation", "bootstrap", "CSS", "express", "firebase", "Go", "HTML", "java", "javascript", "NextJS", "node", "P5JS", "pattern", "PHP", "phyton", "processing", "react", "ruby", "tailwind", "ThreeJS", "UI", "UX", "vector", "browser", "chrome"];

interface ItemFormProps {
  initialData?: SnippetCollection | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ItemForm({ initialData, onSave, onCancel, isSaving }: ItemFormProps) {
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setSelectedTags(initialData.tags || []);
      setLevel(initialData.level || "");
    } else {
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setLevel("");
    }
  }, [initialData]);

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setNewTag("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      tags: selectedTags,
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
          Tags <span className="text-orange-400 text-xs">(Enter or comma to add)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-[42px] border rounded-md focus-within:ring-1 focus-within:ring-orange-400 focus-within:border-orange-400 transition-all">
          {selectedTags.map((tag) => (
            <span 
              key={tag} 
              className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-200"
            >
              {tag}
              <button 
                type="button" 
                onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                className="hover:text-orange-900 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => handleAddTag(newTag)}
            className="flex-1 min-w-[120px] bg-transparent border-none p-0 text-sm focus:ring-0 outline-none"
            placeholder="Add custom tag..."
          />
        </div>
        
        <label className="block text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
          Suggestions
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-gray-50 rounded border border-dashed">
          {TAG_OPTIONS.sort()
            .filter(tag => !selectedTags.includes(tag))
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2 py-0.5 rounded-full text-[11px] bg-white text-gray-500 border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                + {tag}
              </button>
            ))
          }
        </div>
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
          linkEndpoint={`/api/content/${initialData!.id}/banner`}
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
