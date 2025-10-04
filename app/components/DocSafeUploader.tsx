"use client";
import React, { useRef, useState } from "react";

type Props = {
  freeLimit?: number;
};

const KEY = "docsafe_free_used";

export default function DocSafeUploader({ freeLimit = 3 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const openPicker = () => inputRef.current?.click();

  async function cleanAndDownload() {
    if (!file) return openPicker();

    setBusy(true);
    setMsg("Processing on server…");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("strictPdf", "false"); // option V1

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        const errText = ct.includes("application/json")
          ? JSON.stringify(await res.json())
          : await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      // on attend un ZIP en binaire
      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") || "";
      let filename = "docsafe_v1_result.zip";
      const m = /filename\*?=(?:UTF-8'')?([^;]+)|filename="([^"]+)"/i.exec(cd);
      if (m) {
        try {
          filename = decodeURIComponent((m[1] || m[2] || "").trim());
        } catch {
          filename = (m[1] || m[2] || "").trim() || filename;
        }
      }

      // télécharger le ZIP
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMsg("Processed successfully — download should have started.");
    } catch (e: any) {
      setMsg(e?.message || "Unexpected error");
      console.error("DocSafeUploader V1 error:", e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
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
          onClick={cleanAndDownload}
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

      {msg && (
        <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
          {msg}
        </div>
      )}
    </div>
  );
}


