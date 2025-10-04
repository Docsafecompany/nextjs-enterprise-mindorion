"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  compact?: boolean;           // on l'utilise en "compact" sur ta page
  showQuotaLine?: boolean;     // ligne “free beta used x/3”
  onUsageUpdate?: (used: number) => void;
  freeLimit?: number;
  autoProcessOnPick?: boolean; // si tu veux lancer dès sélection
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

function triggerDownload(blob: Blob, filename = "docsafe_v1_result.zip") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function getFilenameFromCD(cd: string | null): string | undefined {
  if (!cd) return;
  const m = /filename\*?=(?:UTF-8'')?([^;]+)|filename="?([^"]+)"?/i.exec(cd);
  if (!m) return;
  try {
    return decodeURIComponent((m[1] || m[2] || "").trim());
  } catch {
    return (m[1] || m[2] || "").trim();
  }
}

export default function DocSafeUploader({
  compact = true,
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

  useEffect(() => {
    onUsageUpdate?.(used);
  }, [used, onUsageUpdate]);

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
      if (autoProcessOnPick && compact) setTimeout(() => cleanAndDownload(files[0]), 40);
    }
  }, [autoProcessOnPick, compact]);

  const onPicked = (f: File | null) => {
    setFile(f);
    setMsg(f ? `Selected: ${f.name}` : null);
    if (f && autoProcessOnPick && compact) setTimeout(() => cleanAndDownload(f), 30);
  };

  async function cleanAndDownload(target: File | null) {
    if (!target) return openPicker();
    setBusy(true);
    setMsg("Cleaning on server (V1) …");

    try {
      const fd = new FormData();
      fd.append("file", target);
      fd.append("strictPdf", "false"); // à true si tu veux l’option stricte

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        let detail = "";
        try {
          detail = ct.includes("application/json") ? JSON.stringify(await res.json()) : await res.text();
        } catch {
          detail = `HTTP ${res.status}`;
        }
        throw new Error(detail || "Processing failed");
      }

      const blob = await res.blob();
      const cd = res.headers.get("content-disposition");
      const filename = getFilenameFromCD(cd) || "docsafe_v1_result.zip";

      // Télécharge le ZIP (contient cleaned.docx + report.html)
      triggerDownload(blob, filename);

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

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(e) => onPicked(e.target.files?.[0] ?? null)}
      />

      {/* MODE COMPACT */}
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
            onClick={() => cleanAndDownload(file)}
            disabled={busy || !file}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            Clean &amp; Download
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
    </div>
  );
}


