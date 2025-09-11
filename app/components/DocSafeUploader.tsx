"use client";
import * as React from "react";

type Mode = "correct" | "rephrase";

export default function DocSafeUploader() {
  const [file, setFile] = React.useState<File | null>(null);
  const [mode, setMode] = React.useState<Mode>("correct");
  const [lang, setLang] = React.useState<string>("auto");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  async function handleProcess() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("mode", mode);
      fd.set("lang", lang);

      const res = await fetch("/api/docsafe", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Processing failed");
      }

      // Cas FICHIER renvoyé par le proxy
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Tente d’extraire un nom depuis Content-Disposition
      const cd = res.headers.get("content-disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `docsafe_${mode}.${file.name.split(".").pop()}`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Cas JSON (jobId) → ici tu ferais un polling GET /api/docsafe?id=...
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Mode */}
      <div className="flex items-center gap-3">
        <label className="font-medium">Mode</label>
        <div className="flex items-center gap-2">
          <button
            className={`rounded-lg border px-3 py-1 ${mode === "correct" ? "bg-indigo-50 border-indigo-300" : ""}`}
            onClick={() => setMode("correct")}
          >
            V1 – Correct
          </button>
          <button
            className={`rounded-lg border px-3 py-1 ${mode === "rephrase" ? "bg-indigo-50 border-indigo-300" : ""}`}
            onClick={() => setMode("rephrase")}
          >
            V2 – Rephrase
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-slate-600">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-md border px-2 py-1 text-sm"
            title="Processing language (when relevant)"
          >
            <option value="auto">Auto</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            {/* ajoute d’autres codes si ton backend les prend */}
          </select>
        </div>
      </div>

      {/* Zone d’upload */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-2xl border-2 border-dashed p-8 text-center"
      >
        <p className="mb-3 font-medium">Drop a PDF, DOCX, or PPTX here</p>
        <p className="mb-4 text-sm text-slate-500">or</p>
        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={onPick} />
        {file && (
          <p className="mt-3 text-sm text-slate-600">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          disabled={!file || busy}
          onClick={handleProcess}
          className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy ? "Processing…" : "Process & Download"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      <p className="text-xs text-slate-500">
        Your document is processed on the server; layout is preserved. We don’t store files after the job completes.
      </p>
    </div>
  );
}
