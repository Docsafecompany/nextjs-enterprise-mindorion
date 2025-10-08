"use client";

import React, { useRef, useState, useEffect } from "react";

type Props = {
  compact?: boolean;
  showQuotaLine?: boolean;
  onUsageUpdate?: (used: number) => void;
  freeLimit?: number;
  autoProcessOnPick?: boolean;
  isPaid?: boolean;                   // Starter/Pro ?
  onDownloadComplete?: () => void;    // feedback after download
};

const KEY = "docsafe_free_used";

function readUsed(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function writeUsed(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(n));
  document.cookie = `${KEY}=${n}; Path=/; Max-Age=${60 * 60 * 24 * 2}; SameSite=Lax`;
}

export default function DocSafeUploader({
  compact = false,
  showQuotaLine = true,
  onUsageUpdate,
  freeLimit = 3,
  autoProcessOnPick = false,
  isPaid = false,
  onDownloadComplete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [used, setUsed] = useState<number>(() => readUsed());
  const [file, setFile] = useState<File | null>(null);

  const backend =
    (typeof window !== "undefined" && (window as any).__DOCSAFE_BACKEND__) || "";

  const openPicker = () => inputRef.current?.click();

  useEffect(() => {
    const handler = () => openPicker();
    window.addEventListener("docsafe:open-picker", handler as unknown as EventListener);
    return () => {
      window.removeEventListener("docsafe:open-picker", handler as unknown as EventListener);
    };
  }, []);

  useEffect(() => {
    onUsageUpdate?.(used);
  }, [used, onUsageUpdate]);

  async function processV1(target: File | null) {
    return coreProcess(target, `${backend}/clean`, "docsafe_v1_result.zip");
  }
  async function processV2(target: File | null) {
    return coreProcess(target, `${backend}/clean-v2`, "docsafe_v2_result.zip");
  }

  async function coreProcess(target: File | null, url: string, fallbackName: string) {
    if (!target) {
      openPicker();
      return;
    }
    setBusy(true);
    setMsg("Processing your document…");

    try {
      if (!backend) throw new Error("Backend URL missing: window.__DOCSAFE_BACKEND__ is empty");

      const fd = new FormData();
      fd.append("file", target);
      fd.append("strictPdf", "false");

      const res = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const blob = await res.blob();

      const cd = res.headers.get("content-disposition") || "";
      const match = /filename\*?=(?:UTF-8'')?([^;]+)|filename="?([^"]+)"?/i.exec(cd);
      const headerFilename = match ? decodeURIComponent((match[1] || match[2] || "").trim()) : "";
      const downloadName =
        headerFilename ||
        ((res.headers.get("content-type") || "").includes("zip") ? fallbackName : "output.zip");

      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);

      const next = used + 1;
      writeUsed(next);
      setUsed(next);
      setMsg("✅ Processed successfully — your file has been downloaded.");
      try { onDownloadComplete?.(); } catch {}
    } catch (err: any) {
      console.error(err);
      setMsg(err?.message || "Unexpected error during processing.");
    } finally {
      setBusy(false);
    }
  }

  const onPicked = (f: File | null) => {
    setFile(f);
    setMsg(f ? `Selected: ${f.name}` : null);
    if (f && autoProcessOnPick && compact) setTimeout(() => processV1(f), 30);
  };

  const handleRephraseClick = () => {
    if (!isPaid) {
      window.location.href = "/pricing"; // Free → Pricing
      return;
    }
    processV2(file);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        className="hidden"
        onChange={(e) => onPicked(e.target.files?.[0] ?? null)}
      />

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

          {/* V1 */}
          <button
            type="button"
            onClick={() => processV1(file)}
            disabled={busy || !file}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            Clean &amp; Download
          </button>

          {/* V2 — Starter/Pro only */}
          <button
            type="button"
            onClick={handleRephraseClick}
            disabled={busy || !file || !isPaid}
            title={!isPaid ? "Starter / Pro only" : undefined}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
              isPaid
                ? "border text-slate-900 hover:bg-gray-50"
                : "border bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Clean &amp; Rephrase
          </button>

          {file && (
            <span className="max-w-[50ch] truncate text-xs text-slate-600">
              Selected: {file.name}
            </span>
          )}
        </div>

        {showQuotaLine && (
          <div className="mt-2 text-xs text-gray-500">
            Free beta limit: {freeLimit} files. Used: {Math.min(used, freeLimit)}/{freeLimit}
          </div>
        )}

        {msg && (
          <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
