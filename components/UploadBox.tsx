"use client";
import { useRef, useState } from "react";
import { hasFreeLeft, incFreeUsed, FREE_LIMIT } from "@/lib/freeQuota";

export default function UploadBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!hasFreeLeft()) {
      setMsg(`Free limit reached (${FREE_LIMIT}). Please create an account or go to Pricing.`);
      return;
    }

    setBusy(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0]);

      const res = await fetch("/api/docsafe/process", {
        method: "POST",
        body: fd,
      });

      if (res.status === 402 || res.status === 429) {
        setMsg("Free limit reached. Please sign up to continue.");
        return;
      }
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Processing failed");
      }

      // Simulate success & increment quota. Replace with real download handling.
      incFreeUsed();
      setMsg("Processed successfully. (Hook your download here.)");
    } catch (e: any) {
      setMsg(e?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed bg-gray-50 p-6 text-center">
      <div className="mx-auto grid max-w-sm place-items-center gap-3">
        <div className="h-16 w-16 rounded-full border" />
        <p className="text-sm text-gray-600">Drag & drop your file here</p>
        <p className="text-xs text-gray-500">or click “Upload file”</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload file"}
        </button>

        <p className="text-xs text-gray-500">Free beta: {FREE_LIMIT} files</p>

        {msg && (
          <div className="mt-2 text-xs text-gray-700">{msg} <a href="/pricing" className="font-semibold text-indigo-600 hover:text-indigo-500">See Pricing</a></div>
        )}
      </div>
    </div>
  );
}

