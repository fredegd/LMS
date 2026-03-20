"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import ContentTable from "./_components/ContentTable";
import ItemForm from "./_components/ItemForm";
import ChapterManager from "./_components/ChapterManager";
import { SnippetCollection, SnippetPreview } from "../../../../types/hygraph";

export default function Dashboard() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [items, setItems] = useState<SnippetPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<SnippetCollection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SnippetPreview | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data.snippetCollections || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadItemDetails = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/content/${id}`);
      if (!res.ok) throw new Error("Failed to load item details");
      const data = await res.json();
      return data.snippetCollection;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleCreate = async (data: any) => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to create item.");
      }
      setView("list");
      await loadItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editItem?.id) return;
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/content/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to update item.");
      }
      const refreshed = await loadItemDetails(editItem.id);
      if (refreshed) setEditItem(refreshed);
      await loadItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/content/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to delete item.");
      }
      setDeleteTarget(null);
      await loadItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = async (item: SnippetPreview) => {
    setError("");
    const detailed = await loadItemDetails(item.id);
    if (detailed) {
      setEditItem(detailed);
      setView("edit");
    }
  };

  const refreshEditItem = async () => {
    if (!editItem?.id) return;
    const refreshed = await loadItemDetails(editItem.id);
    if (refreshed) setEditItem(refreshed);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {view === "list" ? (
          <>
            <h1 className="text-2xl font-semibold">Content Dashboard</h1>
            <button
              onClick={() => {
                setView("create");
                setEditItem(null);
                setError("");
              }}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Item
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setView("list");
                setEditItem(null);
                setError("");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to list
            </button>
            <div />
          </>
        )}
      </div>

      {/* Global error banner */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600 ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-2">Delete Item</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget.title}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isSaving}
                className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isSaving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Views */}
      {view === "list" && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <p className="text-gray-400">Loading…</p>
            </div>
          ) : (
            <ContentTable
              items={items}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          )}
        </>
      )}

      {view === "create" && (
        <div className="rounded-lg border bg-white p-6">
          <ItemForm
            onSave={handleCreate}
            onCancel={() => {
              setView("list");
              setError("");
            }}
            isSaving={isSaving}
          />
        </div>
      )}

      {view === "edit" && editItem && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <ItemForm
              initialData={editItem}
              onSave={handleUpdate}
              onCancel={() => {
                setView("list");
                setEditItem(null);
                setError("");
              }}
              isSaving={isSaving}
            />
          </div>
          <div className="rounded-lg border bg-white p-6">
            <ChapterManager
              itemId={editItem.id}
              chapters={editItem.chapterSection || []}
              onRefresh={refreshEditItem}
            />
          </div>
        </div>
      )}
    </div>
  );
}
