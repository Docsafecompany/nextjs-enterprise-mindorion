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

// Extrait le nom de fichier depuis Content-Disposition
function filenameFromDisposition(disp?: string | null) {
  if (!disp) return undefined;
  const m =
    /filename\*?=(?:UTF-8'')?([^;]+)|filename="?([^"]+)"?/i.exec(disp);
  if (!m) return undefined;
  try {
    return decodeURIComponent((m[1] || m[2] || "").trim());
  } catch {
    return (m[1] || m[2] || "").trim();
  }
}

// Déclenche un téléchargement navigateur à partir d'un Blob
async function downloadBlob(blob: Blob, fallbackName = "docsafe_result.zip") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fallbackName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
    window.addEventListener(
      "docsafe:open-picker",
      handler as unknown as EventListener
    );
    return () => {
      window.removeEventListener(
        "docsafe:open-picker",
        handler as unknown as EventListener
      );
    };
  }, []);

  useEffect(() => {
    onUsageUpdate?.(used);
  }, [used, onUsageUpdate]);

  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      prevent(e);
      const files = e.dataTransfer?.files;
      if (files && files[0]) {
        setFile(files[0]);
        setMsg(`Selected: ${files[0].name}`);
        if (autoProcessOnPick && compact) setTimeout(() => process(files[0]), 50);
      }
    },
    [autoProcessOnPick, compact]
  );

  const onPicked = (f: File | null) => {
    setFile(f);
    setMsg(f ? `Selected: ${f.name}` : null);
    if (f && autoProcessOnPick && compact) setTimeout(() => process(f), 30);
  };

  async function process(target: File | null) {
    if (!target) {
      openPicker();
      return;
    }
    setBusy(true);
    setMsg("Processing on server… layout preserved. Please wait.");
    try {
      const fd = new FormData();
      fd.append("file", target);

      // 🔁 IMPORTANT :
      // "rephrase" => route /clean-v2 (cleaned + rephrased + report)
      // "correct"  => route /clean   (cleaned + report)
      fd.append("mode", "rephrase");
      fd.append("lang", "auto");
      fd.append("strictPdf", "false");

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });

      const ct = res.headers.get("content-type") || "";

      // Gestion des limites
      if (res.status === 402 || res.status === 429) {
        setMsg(
          `Free limit reached (${freeLimit}). Create an account or see Pricing.`
        );
        return;
      }

      // Erreurs: essaye de lire l'erreur JSON/texte proprement
      if (!res.ok) {
        let errText = "";
        try {
          errText = ct.includes("application/json")
            ? (await res.json())?.error || ""
            : await res.text();
        } catch {}
        throw new Error(
          errText || `Processing failed (HTTP ${res.status}).`
        );
      }

      // Lecture binaire
      const blob = await res.blob();

      // Si malgré tout on reçoit du JSON, on l'affiche (cas d'erreur upstream)
      if ((ct || "").includes("application/json")) {
        const text = await blob.text().catch(() => "");
        setMsg(text || "Unexpected JSON response from server.");
        return;
      }

      // Nom du fichier
      const disp = res.headers.get("content-disposition");
      const name = filenameFromDisposition(disp) || "docsafe_result.zip";

      // ⬇️ Déclenche le téléchargement
      await downloadBlob(blob, name);

      // Quota local (anonyme)
      const next = used + 1;
      writeUsed(next);
      setUsed(next);

      setMsg("Processed successfully — your download has started.");
    } catch (err: any) {
      setMsg(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
              Free beta limit: {freeLimit} files (anonymous). Used:{" "}
              {Math.min(used, freeLimit)}/{freeLimit}
            </div>
          )}

          {msg && (
            <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
              {msg} ·{" "}
              <a
                href="/pricing"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Pricing
              </a>{" "}
              •{" "}
              <a
                href="/sign-up"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
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
          <p className="text-sm font-medium text-gray-700">
            Drop a PDF, DOCX, or PPTX here
          </p>
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
              disabled={busy || !file}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              Process &amp; Download
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Free beta limit: {freeLimit} files (anonymous). Used:{" "}
            {Math.min(used, freeLimit)}/{freeLimit}
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


