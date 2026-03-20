"use client";
import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * BannerUpload — drag-and-drop / click-to-browse image upload with preview.
 *
 * @param {string|null}  currentUrl   — existing banner URL (shows preview)
 * @param {Function}     onUploaded   — called with (assetId, url) after a successful upload
 * @param {string}       linkEndpoint — the POST endpoint to link the asset (e.g. /api/content/[id]/banner)
 * @param {boolean}      disabled
 */
export default function BannerUpload({ currentUrl, onUploaded, linkEndpoint, disabled }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Invalid type "${file.type}". Use JPEG, PNG, WebP, GIF, or SVG.`);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`);
      return;
    }

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      // 1. Upload to Hygraph via our API
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const body = await uploadRes.json();
        throw new Error(body.error || "Upload failed");
      }
      const { id: assetId, url } = await uploadRes.json();

      // 2. Link to content record
      if (linkEndpoint) {
        const linkRes = await fetch(linkEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetId }),
        });
        if (!linkRes.ok) {
          const body = await linkRes.json();
          throw new Error(body.error || "Failed to link banner");
        }
      }

      // Use the published CDN url for the preview
      setPreview(url);
      onUploaded?.(assetId, url);
    } catch (err) {
      setError(err.message);
      // Revert to the previous banner on error
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so re-selecting the same file triggers change
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Banner Image</label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed
          transition-colors cursor-pointer overflow-hidden
          ${dragOver ? "border-orange-400 bg-orange-50" : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/30"}
          ${disabled || uploading ? "opacity-60 cursor-not-allowed" : ""}
          ${preview ? "h-40" : "h-32"}
        `}
      >
        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Banner preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div
          className={`
            relative z-10 flex flex-col items-center gap-1 px-4 py-3 rounded-lg
            ${preview ? "bg-black/50 text-white" : "text-gray-500"}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Uploading…</span>
            </>
          ) : (
            <>
              {preview ? <ImageIcon className="h-5 w-5" /> : <Upload className="h-6 w-6" />}
              <span className="text-xs">
                {preview ? "Click or drop to replace" : "Click or drag image here"}
              </span>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={onFileChange}
          className="hidden"
          disabled={disabled || uploading}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-md px-3 py-2">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
