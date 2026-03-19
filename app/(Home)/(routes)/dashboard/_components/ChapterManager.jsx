"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";

function ChapterForm({ chapter, onSave, onCancel, isSaving }) {
  const [title, setTitle] = useState(chapter?.title || "");
  const [chapterDescription, setChapterDescription] = useState(
    chapter?.chapterDescription || "",
  );
  const [chapterSnippet, setChapterSnippet] = useState(
    chapter?.chapterSnippet || "",
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, chapterDescription, chapterSnippet });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-md border border-orange-200 bg-orange-50/30 p-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chapter Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          placeholder="Chapter title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description{" "}
          <span className="text-gray-400 text-xs">(Markdown)</span>
        </label>
        <textarea
          rows={4}
          value={chapterDescription}
          onChange={(e) => setChapterDescription(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm font-mono focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-y"
          placeholder="Chapter description in Markdown"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code Snippet{" "}
          <span className="text-gray-400 text-xs">(Markdown)</span>
        </label>
        <textarea
          rows={6}
          value={chapterSnippet}
          onChange={(e) => setChapterSnippet(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm font-mono focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 resize-y"
          placeholder="Code snippet in Markdown"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !title.trim()}
          className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-sm text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? "Saving…" : chapter?.id ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default function ChapterManager({ itemId, chapters = [], onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCreate = async (data) => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/content/${itemId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Create failed");
      setIsAdding(false);
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (chapterId, data) => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/content/${itemId}/chapters/${chapterId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      setEditingId(null);
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (chapterId) => {
    if (!confirm("Delete this chapter?")) return;
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/content/${itemId}/chapters/${chapterId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Chapters ({chapters.length})
        </h3>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
            }}
            className="flex items-center gap-1 rounded-md border border-dashed border-orange-300 px-3 py-1.5 text-sm text-orange-500 hover:bg-orange-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Chapter
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {isAdding && (
        <ChapterForm
          onSave={handleCreate}
          onCancel={() => setIsAdding(false)}
          isSaving={isSaving}
        />
      )}

      {chapters.map((ch) => (
        <div
          key={ch.id}
          className="rounded-md border bg-white overflow-hidden"
        >
          {editingId === ch.id ? (
            <div className="p-3">
              <ChapterForm
                chapter={ch}
                onSave={(data) => handleUpdate(ch.id, data)}
                onCancel={() => setEditingId(null)}
                isSaving={isSaving}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() => toggle(ch.id)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors min-w-0"
                >
                  {expanded[ch.id] ? (
                    <ChevronUp className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate">{ch.title}</span>
                </button>
                <div className="flex gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => {
                      setEditingId(ch.id);
                      setIsAdding(false);
                    }}
                    className="rounded p-1 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ch.id)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {expanded[ch.id] && (
                <div className="border-t px-4 py-3 text-sm text-gray-600 space-y-2">
                  {ch.chapterDescription && (
                    <div>
                      <span className="font-medium text-gray-500">Description: </span>
                      <span className="whitespace-pre-wrap">{ch.chapterDescription}</span>
                    </div>
                  )}
                  {ch.chapterSnippet && (
                    <div>
                      <span className="font-medium text-gray-500">Snippet: </span>
                      <pre className="mt-1 whitespace-pre-wrap bg-gray-50 rounded p-2 text-xs font-mono overflow-auto max-h-48">
                        {ch.chapterSnippet}
                      </pre>
                    </div>
                  )}
                  {!ch.chapterDescription && !ch.chapterSnippet && (
                    <p className="italic text-gray-400">No content yet.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
