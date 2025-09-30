"use client";

import { useCallback, useRef, useState } from "react";
import { FREE_LIMIT, getFreeUsed, incFreeUsed } from "@/lib/freeQuota";

export default function DocSafeUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [used, setUsed] = useState<number>(() => getFreeUsed());
  const left = Math.max(FREE_LIMIT - used, 0);

  // open file picker
  const onBrowse = () => inputRef.current?.click();

  // DnD handlers
  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      prevent(e);
      if (busy) return;
      const files = e.dataTransfer?.files;
      handleFiles(files);
    },
    [busy]
  );

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setMsg(null);

    try {
      // Only V1 (clean + correct) — no UI switch.
      const fd = new FormData();
      fd.append("file", files[0]);
      fd.append("mode", "correct"); // fixed to V1
      fd.append("lang", "auto");

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });
      if (res.status === 402 || res.status === 429) {
        setMsg(`Free limit reached (${FREE_LIMIT}). Create an account or see Pricing.`);
        return;
      }
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Processing failed");
      }

      // success -> increase counter (client-side mirror of server cookie)
      const next = incFreeUsed();
      setUsed(next);
      setMsg("Processed successfully. (Hook your download here.)");
    } catch (e: any) {
      setMsg(e?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Hidden native input; we use our own 'Upload file' button */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag & drop area + custom button */}
      <div
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={onDrop}
        className="rounded-2xl border border-dashed bg-gray-50 p-6 text-center"
      >
        <p className="text-sm text-gray-700 font-medium">Drop a PDF, DOCX, or PPTX here</p>
        <p className="mt-1 text-xs text-gray-500">or</p>

        {/* THIS replaces the native 'Choose file' */}
        <button
          type="button"
          onClick={onBrowse}
          disabled={busy}
          className="mt-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload file"}
        </button>
      </div>

      {/* Process Button (kept for parity with your layout) */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={() => onBrowse()}
          disabled={busy}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          Process & Download
        </button>
      </div>

      {/* Quota + message */}
      <div className="text-xs text-gray-500">
        Free beta limit: {FREE_LIMIT} files (anonymous). Used: {Math.min(used, FREE_LIMIT)}/{FREE_LIMIT}
      </div>

      {msg && (
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
          {msg}{" "}
          <a href="/pricing" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Pricing
          </a>{" "}
          •{" "}
          <a href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create account
          </a>
        </div>
      )}
    </div>
  );
}


