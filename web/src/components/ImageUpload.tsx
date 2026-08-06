"use client";

import { useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  previewClassName?: string;
};

export default function ImageUpload({
  label = "Image",
  value,
  onChange,
  previewClassName = "h-32 w-full object-cover",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Échec upload");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Échec upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="mb-1 block text-xs text-[var(--text-muted)]">{label}</label>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Aperçu"
          className={`rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] ${previewClassName}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] text-sm text-[var(--text-muted)] ${previewClassName}`}
        >
          Aucune image
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="btn-secondary cursor-pointer py-2 text-sm">
          {uploading ? "Envoi…" : "Choisir une image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {value && (
          <button
            type="button"
            className="btn-secondary py-2 text-sm text-red-300"
            onClick={() => onChange("")}
          >
            Retirer
          </button>
        )}
      </div>
      <input
        className="form-input text-sm"
        placeholder="Ou coller une URL d'image…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
