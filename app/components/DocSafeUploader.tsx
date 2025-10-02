"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/** Anonymous free quota (same logic as before) */
const FREE_LIMIT = 3;
const KEY = "docsafe_free_used";

function getFreeUsed(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function setFreeUsed(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(n));
  document.cookie = `${KEY}=${n}; Path=/; Max-Age=${60 * 60 * 24 * 2}; SameSite=Lax`;
}

type Props = {
  /** When true, renders a minimal UI: just file name + Process button (no big dropzone). */
  compact?: boolean;
  /** Optional: auto-process immediately after picking a file (compact mode only). */
  autoProcessOnPick?: boolean;
};

export default function DocSafeUploader({ compact = false, autoProcessOnPick = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [used, setUsed] = useState<number>(() => getFreeUsed());
  const [file, setFile] = useState<File | null>(null);

  const left = Math.max(FREE_LIMIT - used, 0);

  const openPicker = () => inputRef.current?.click();

  // Allow outside buttons to open the picker
  useEffect(() => {
    const handler = () => openPicker();
    window.addEventListener("docsafe:open-picker", handler as unknown as EventListener);
    return () => {
      window.removeEventListener("docsafe:open-picker", handler as unknown as EventListener);
    };
  }, []);

  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    prevent(e);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      setFile(files[0]);
      setMsg(`Selected: ${files[0].name}`);
    }
  }, []);

  async function process(fileToUse: File | null) {
    if (!fileToUse) {
      openPicker();
      return;
    }

    setBusy(true);
    setMsg("Processing…");

    try {
      const fd = new FormData();
      fd.append("file", fileToUse);
      fd.append("mode", "correct"); // V1 forced
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

      // If upstream returns a downloadable stream, browser will trigger download automatically by navigation.
      // If you return JSON/jobId instead, adapt here accordingly.

      const next = used + 1;
      setFreeUsed(next);
      setUsed(next);
      setMsg("Processed successfully.");
    } catch (e: any) {
      setMsg(e?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  const handlePicked = (f: File | null) => {
    setFile(f);
    setMsg(f ? `Selected: ${f.name}` : null);
    if (f && compact && autoProcessOnPick) {
      // Fire after a small tick so UI updates first
      setTimeout(() => process(f), 50);
    }
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-3"}>
      {/* Hidden input (shared) */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(e) => handlePicked(e.target.files?.[0] ?? null)}
      />

      {compact ? (
        /* --- COMPACT UI: no dropzone, just actions and feedback --- */
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openPicker}
              disabled={busy}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {busy ? "Uploading…" : "Choose file"}
            </button>
            <button
              type="button"
              onClick={() => process(file)}
              disabled={busy || !file}
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
            >
              Process & Download
            </button>

            {file && (
              <span className="text-xs text-slate-600 truncate">Selected: {file.name}</span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Free beta limit: {FREE_LIMIT} files (anonymous). Used:{" "}
            {Math.min(used, FREE_LIMIT)}/{FREE_LIMIT}
          </div>

          {msg && (
            <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
              {msg} ·{" "}
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
      ) : (
        /* --- FULL UI (kept for future if you re-enable the big dropzone) --- */
        <div
          onDragOver={prevent}
          onDragEnter={prevent}
          onDrop={onDrop}
          className="rounded-2xl border border-dashed bg-gray-50 p-6 text-center"
        >
          <p className="text-sm font-medium text-gray-700">Drop a PDF, DOCX, or PPTX here</p>
          <p className="mt-1 text-xs text-gray-500">or</p>

          <button
            type="button"
            onClick={openPicker}
            disabled={busy}
            className="mt-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {busy ? "Uploading…" : "Upload file"}
          </button>

          {file && (
            <div className="mt-2 text-xs text-gray-700">
              Selected file: <span className="font-semibold">{file.name}</span>
            </div>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={() => process(file)}
              disabled={busy}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              Process & Download
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Free beta limit: {FREE_LIMIT} files (anonymous). Used: {Math.min(used, FREE_LIMIT)}/
            {FREE_LIMIT}
          </div>

          {msg && (
            <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
              {msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


