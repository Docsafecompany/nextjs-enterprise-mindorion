"use client";
import * as React from "react";

type Mode = "correct" | "rephrase";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || ""; // e.g. https://docsafe-backend-beta-1.onrender.com

export default function DocSafeUploader() {
  const [file, setFile] = React.useState<File | null>(null);
  const [mode, setMode] = React.useState<Mode>("correct");
  const [lang, setLang] = React.useState<string>("auto"); // pas utilisé par le backend (on le garde pour UI)
  const [strictPdf, setStrictPdf] = React.useState<boolean>(true); // option backend
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
    if (!BACKEND) {
      setError("Missing NEXT_PUBLIC_BACKEND_URL on the frontend.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      // === APPEL DIRECT AU BACKEND RENDER ===
      const endpoint = `${BACKEND}/${mode === "rephrase" ? "clean-v2" : "clean"}`;

      const fd = new FormData();
      fd.append("file", file);                 // le backend attend "file"
      fd.append("strictPdf", String(strictPdf)); // "true" | "false" (option PDF)

      const res = await fetch(endpoint, { method: "POST", body: fd });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `HTTP ${res.status}`);
      }

      // Réponse = ZIP binaire (docsafe_v1_result.zip / docsafe_v2_result.zip)
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Nom de fichier par défaut si le header est absent
      const cd = res.headers.get("content-disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const fallback = mode === "rephrase" ? "docsafe_v2_result.zip" : "docsafe_v1_result.zip";
      const filename = match?.[1] || fallback;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Mode + Strict PDF */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="font-medium">Mode</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded-lg border px-3 py-1 ${
              mode === "correct" ? "bg-indigo-50 border-indigo-300" : ""
            }`}
            onClick={() => setMode("correct")}
          >
            V1 – Correct
          </button>
          <button
            type="button"
            className={`rounded-lg border px-3 py-1 ${
              mode === "rephrase" ? "bg-indigo-50 border-indigo-300" : ""
            }`}
            onClick={() => setMode("rephrase")}
          >
            V2 – Rephrase
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Lang reste visuel; non utilisé server-side */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
              title="Processing language (UI only)"
            >
              <option value="auto">Auto</option>
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>

          {/* Strict PDF -> envoyé au backend */}
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={strictPdf}
              onChange={(e) => setStrictPdf(e.target.checked)}
            />
            Strict PDF
          </label>
        </div>
      </div>

      {/* Zone d’upload */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-2xl border-2 border-dashed p-8 text-center"
        onClick={() => (document.getElementById("docsafe-file") as HTMLInputElement)?.click()}
      >
        <p className="mb-3 font-medium">Drop a PDF, DOCX, or PPTX here</p>
        <p className="mb-4 text-sm text-slate-500">or</p>
        <input id="docsafe-file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={onPick} className="hidden" />
        <button
          type="button"
          className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
          onClick={(e) => {
            e.stopPropagation();
            (document.getElementById("docsafe-file") as HTMLInputElement)?.click();
          }}
        >
          Choose file
        </button>
        {file && (
          <p className="mt-3 text-sm text-slate-600">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
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

      <p className="text-[10px] text-slate-400">
        Backend: <span className={BACKEND ? "text-emerald-600" : "text-red-600"}>{BACKEND || "NEXT_PUBLIC_BACKEND_URL not set"}</span>
      </p>
    </div>
  );
}

