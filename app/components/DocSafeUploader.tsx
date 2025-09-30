"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/** Client-side mirror of the anonymous free quota */
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

export default function DocSafeUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [used, setUsed] = useState<number>(() => getFreeUsed());
  const [file, setFile] = useState<File | null>(null);

  const left = Math.max(FREE_LIMIT - used, 0);

  /** Open file picker */
  const openPicker = () => inputRef.current?.click();

  /** Listen to global event from the left CTA */
  useEffect(() => {
    const handler = () => openPicker();
    window.addEventListener("docsafe:open-picker", handler as EventListener);
    return () => window.removeEventListener("docsafe:open-picker", handler as EventListener);
  }, []);

  /** DnD helpers */
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

  /** Process (always V1 under the hood) */
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

      const next = used + 1;
      setFreeUsed(next);
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
      {/* Hidden native input (double hide to avoid any “Choose file”) */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFile(f);
          setMsg(f ? `Selected: ${f.name}` : null);
        }}
      />

      {/* Drag & drop + our custom “Upload file” button */}
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
      </div>

      {/* Process button */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={() => process(file)}
          disabled={busy}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          Process & Download
        </button>
      </div>

      {/* Quota + feedback */}
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


