"use client";

import { useRef, useState } from "react";
import { Upload, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  onUpload: (dataUrl: string, file: File) => void;
  label?: string;
  hint?: string;
  maxSizeMb?: number;
  className?: string;
}

export function PhotoUpload({ onUpload, label = "Upuść zdjęcie lub kliknij", hint = "JPG, PNG, max 5 MB", maxSizeMb = 5, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Plik nie jest zdjęciem.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Plik za duży. Max ${maxSizeMb} MB.`);
      return;
    }
    setError(null);
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLoading(false);
      onUpload(reader.result as string, file);
    };
    reader.onerror = () => {
      setLoading(false);
      setError("Nie udało się wczytać pliku.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handle(f);
        }}
        onClick={() => ref.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition",
          dragging ? "border-brand-500 bg-brand-50" : "border-ink-200 bg-white/40 hover:border-brand-300 hover:bg-white/70"
        )}
      >
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-3">
          {loading ? <Upload className="h-5 w-5 animate-bounce" /> : <ImagePlus className="h-5 w-5" />}
        </div>
        <div className="font-medium text-ink-900 text-sm">{label}</div>
        <div className="text-xs text-ink-500 mt-1">{hint}</div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <div className="text-xs text-rose-600 flex items-center gap-1.5">
          <X className="h-3 w-3" /> {error}
        </div>
      )}
    </div>
  );
}
