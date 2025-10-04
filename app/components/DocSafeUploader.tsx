// components/DocSafeUploader.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  compact?: boolean;
  showQuotaLine?: boolean;
  onUsageUpdate?: (used: number) => void;
  freeLimit?: number;
  autoProcessOnPick?: boolean;
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

function parseFilenameFromCD(cd: string | null | undefined): string {
  if (!cd) return "docsafe_result.zip";
  const m = /filename\*?=(?:UTF-8'')?([^;]+)|filename="?([^"]+)"?/i.exec(cd);
  if (!m) return "docsafe_result.zip";
  try { return decodeURIComponent((m[1] || m[2] || "").trim()); }
  catch { return (m[1] || m[2] || "").trim() || "docsafe_result.zip"; }
}

export default function DocSafeUploader({
  compact = false,
  showQuotaLine = true,
  onUsageUpdate,
  freeLimit = 3,
  autoProcessOnPick = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [used, setUsed] = useState<number>(() => readUsed());
  const [file, setFile] = useState<File | null>(null);

  const openPicker = () => inputRef.current?.click();

  useEffect(() => {
    const handler = () => openPicker();
    window.addEventListener("docsafe:open-picker", handler as unknown as EventListener);
    return () => window.removeEventListener("docsafe:open-picker", handler as unknown as EventListener);
  }, []);

  useEffect(() => { onUsageUpdate?.(used); }, [used, onUsageUpdate]);

  const prevent = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    prevent(e);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      setFile(files[0]);
      setMsg(`Selected: ${files[0].name}`);
      if (autoProcessOnPick && compact) setTimeout(() => process(files[0]), 50);
    }
  }, [autoProcessOnPick, compact]);

  async function process(target: File | null) {
    if (!target) { openPicker(); return; }
    setBusy(true);
    setMsg("Processing on server…");
    try {
      const fd = new FormData();
      fd.append("file", target);
      fd.append("lang", "auto");
      fd.append("strictPdf", "false");

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const txt = ct.includes("json") ? JSON.stringify(await res.json()) : await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const blob = await res.blob();

      // Refuse tout ce qui n'est pas ZIP/octet-stream
      if (!ct.startsWith("application/zip") && !ct.startsWith("application/octet-stream")) {
        const txt = await blob.text().catch(() => "");
        throw new Error(txt || "Unexpected response (not a ZIP).");
      }
      // Refuse les micro-zips “vides”
      if (blob.size < 2048) {
        const txt = await blob.text().catch(() => "");
        throw new Error(txt || "ZIP too small (upstream likely timed out).");
      }

      const filename = parseFilenameFromCD(res.headers.get("content-disposition"));
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      const next = used + 1;
      writeUsed(next);
      setUsed(next);
      setMsg("Processed successfully — download should have started.");
    } catch (err: any) {
      setMsg(err?.message || "Unexpected error");
      console.error("DocSafeUploader error:", err);
    } finally {
      setBusy(false);
    }
  }

  const onPicked = (f: File | null) => {
    setFile(f);
    setMsg(f ? `Selected: ${f.name}` : null);
    if (f && autoProcessOnPick && compact) setTimeout(() => process(f), 30);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(e) => onPicked(e.target.files?.[0] ?? null)}
      />

      {compact ? (
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
              Process &amp; Download
            </button>

            {file && (
              <span className="max-w-[50ch] truncate text-xs text-slate-600">
                Selected: {file.name}
              </span>
            )}
          </div>

          {showQuotaLine && (
            <div className="mt-2 text-xs text-gray-500">
              Free beta limit: {freeLimit} files (anonymous). Used: {Math.min(used, freeLimit)}/{freeLimit}
            </div>
          )}

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
              Process &amp; Download
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Free beta limit: {freeLimit} files (anonymous). Used: {Math.min(used, freeLimit)}/{freeLimit}
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

