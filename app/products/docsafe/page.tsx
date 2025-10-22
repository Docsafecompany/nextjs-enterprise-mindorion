// app/products/docsafe/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ----------------------------- Small UI helpers ---------------------------- */
function Benefit({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 text-slate-900">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-indigo-50 text-sm">
          {icon}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  );
}

function ReviewCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 px-4 py-4 md:px-5">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-4 text-left font-medium text-slate-900">
        <span className="text-slate-400 transition group-open:rotate-180">▾</span>
        {q}
      </summary>
      <div className="px-4 pb-4 pt-0 text-slate-600">{a}</div>
    </details>
  );
}

/* ----------------------------- Feedback (post) ----------------------------- */
function FeedbackBox({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  const submit = async () => {
    try {
      setSending(true);
      setError(null);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, email: email || undefined, message }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to send feedback");
      setDone(true);
      setMessage("");
      setEmail("");
      setRating(5);
    } catch (e: any) {
      setError(e?.message || "Error while sending feedback");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Share quick feedback</h3>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      {done ? (
        <p className="mt-2 text-sm text-green-600">Thank you! Your feedback was sent.</p>
      ) : (
        <>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">Rating</label>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={`h-8 w-8 rounded-md border text-sm ${
                      rating >= n ? "bg-yellow-100 border-yellow-300" : "bg-white border-slate-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600">Your email (optional)</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@domain.com"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600">Comment</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="What worked well? Anything to improve?"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-3 flex gap-2">
            <button
              onClick={submit}
              disabled={sending || message.trim().length < 3}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {sending ? "Sending…" : "Send feedback"}
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------- Dropzone (Adobe-like) ----------------------- */
// Construit toujours "<nom d’origine> cleaned.<ext>" ; si la réponse est un ZIP => .zip
function computeDownloadName(original: string, res: Response, blob: Blob) {
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  const ext = dot > 0 ? original.slice(dot + 1).toLowerCase() : "";
  const ct = (res.headers.get("content-type") || blob.type || "").toLowerCase();
  const isZip = ct.includes("zip");
  if (isZip) return `${base} cleaned.zip`;
  const keep = ["pdf", "doc", "docx", "ppt", "pptx"].includes(ext) ? ext : "zip";
  return `${base} cleaned.${keep}`;
}

function DropzoneUploader({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const openPicker = () => inputRef.current?.click();

  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragOver(false);
    const f = ev.dataTransfer?.files?.[0];
    if (f) {
      setFile(f);
      handleProcess(f);
    }
  };

  const onPick = (f: File | null) => {
    setFile(f);
    if (f) handleProcess(f);
  };

  const startOptimisticProgress = (estSeconds: number) => {
    setProgress(0);
    setEta(`${estSeconds}s`);
    const start = Date.now();
    const target = Math.max(6, estSeconds);
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const pct = Math.min(90, Math.floor((elapsed / target) * 90));
      const remaining = Math.max(0, Math.ceil(target - elapsed));
      setProgress(pct);
      setEta(`${remaining}s`);
    }, 300);
    return () => clearInterval(id);
  };

  async function handleProcess(target: File) {
    try {
      setBusy(true);
      setMessage(null);
      setProgress(0);
      setEta("");

      const est = Math.ceil(target.size / (1024 * 1024)) + 3;
      const stopProgress = startOptimisticProgress(est);

      const fd = new FormData();
      fd.append("file", target);
      fd.append("strictPdf", "false");

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });

      stopProgress();

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      setProgress(100);
      setEta("");

      const blob = await res.blob();

      const downloadName = computeDownloadName(target.name, res, blob);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage("✅ Processed successfully — your file has been downloaded.");
      onDone?.();
    } catch (err: any) {
      setMessage(err?.message || "Unexpected error. Please try again.");
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1200);
    }
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      {/* Encadré drop (titre + sous-titre + illustration) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={onDrop}
        className={`relative mx-auto grid min-h-[320px] w-full place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition
          ${dragOver ? "border-indigo-400 bg-indigo-50/70" : "border-indigo-200 bg-white"}`}
      >
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Clean, correct & preserve your layout
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Drag &amp; drop a PDF, DOCX or PPTX, or click below.
          </p>

          <button
            type="button"
            onClick={openPicker}
            disabled={busy}
            className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {busy ? "Working…" : "Select a file"}
          </button>

          {file && (
            <div className="mt-2 max-w-[56ch] truncate text-xs text-slate-500">
              Selected: {file.name}
            </div>
          )}

          {(busy || progress > 0) && (
            <div className="mx-auto mt-4 w-full max-w-md">
              <div className="h-2 w-full overflow-hidden rounded bg-slate-100">
                <div
                  className="h-full rounded bg-gradient-to-r from-indigo-600 to-violet-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {progress < 100 ? <>Processing… ~ {eta} left</> : <>Finishing…</>}
              </div>
            </div>
          )}

          {message && (
            <div className="mx-auto mt-3 max-w-md rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
              {message}
            </div>
          )}
        </div>

        {/* Illustration dans l’encadré (coin bas-droite) */}
        <div className="pointer-events-none absolute bottom-6 right-6 hidden sm:block">
          <div className="grid h-40 w-40 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100">
            <div className="text-5xl">📄✨</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Page ------------------------------------ */
export default function DocSafePage() {
  const [plan, setPlan] = useState<string>("free");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fromWindow =
      (typeof window !== "undefined" && (window as any).__USER_PLAN__) || "";
    const fromLS =
      typeof window !== "undefined" ? localStorage.getItem("plan") || "" : "";
    const p = String(fromWindow || fromLS || "free").toLowerCase();
    setPlan(p);
  }, []);
  const isPaid = useMemo(() => plan === "starter" || plan === "pro", [plan]);
  void isPaid;

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-10 md:py-14">
      {/* HERO container (dropzone) */}
      <section className="rounded-[24px] border border-indigo-100 bg-gradient-to-b from-indigo-600/15 via-indigo-500/10 to-violet-500/10 p-6 md:p-8">
        <DropzoneUploader onDone={() => setShowFeedback(true)} />
        <FeedbackBox visible={showFeedback} onClose={() => setShowFeedback(false)} />
      </section>

      {/* HOW TO — liste + visuel DANS LE MÊME ENCADRÉ (visuel à droite) */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold">How to use DocSafe</h2>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid items-stretch md:grid-cols-[1fr,360px]">
            {/* Étapes */}
            <ol className="divide-y divide-slate-200">
              {[
                {
                  n: "1",
                  title: 'Click “Select a file” or drag & drop.',
                  sub: "Choose a PDF, DOCX, or PPTX and drop it in the box above.",
                },
                {
                  n: "2",
                  title: "We process your document automatically.",
                  sub: "Hidden data is removed and obvious mistakes are fixed while preserving layout.",
                },
                {
                  n: "3",
                  title: "Download your cleaned file.",
                  sub: "We keep the original format and append _cleaned to the filename.",
                },
                {
                  n: "4",
                  title: "Share it with confidence.",
                  sub: "Ready-to-share output, with metadata and comments stripped.",
                },
              ].map(({ n, title, sub }) => (
                <li
                  key={n}
                  className="flex items-start gap-3 px-5 py-4"
                >
                  <span className="mt-0.5 w-6 shrink-0 text-lg font-semibold leading-6 text-slate-400">
                    {n}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{sub}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Visuel à droite, centré verticalement et séparé par une bordure */}
            <div className="border-t border-slate-200 p-6 md:border-t-0 md:border-l md:p-0">
              <div className="flex h-full items-center justify-center">
                <div className="grid h-56 w-[320px] place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-indigo-100">
                  <div className="text-6xl">📑✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold">Why use DocSafe?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Benefit icon="🛡️" title="Privacy & Security">
            Files are processed securely and deleted after processing. We never use your data to
            train models.
          </Benefit>
          <Benefit icon="✍️" title="Professional result">
            Deliver polished documents that inspire trust with clear, correct writing.
          </Benefit>
          <Benefit icon="⚡" title="Save time">
            Let AI handle corrections in seconds instead of manual edits.
          </Benefit>
          <Benefit icon="🎨" title="Layout preserved">
            Your design stays intact — tables, slides, images and styles remain unchanged.
          </Benefit>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mt-12">
        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
          <ReviewCard title="DocSafe Reviews" subtitle="44 reviews • ★★★★☆" />
          <ReviewCard title="Capterra" subtitle="23 ratings • ★★★★☆" />
          <ReviewCard title="Workspace Marketplace" subtitle="1,000+ users • ★★★★☆" />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h3 className="mb-3 text-xl font-bold text-slate-900">Got questions?</h3>
        <div className="space-y-3">
          <FAQItem
            q="Is my data deleted after upload?"
            a="Yes. Files are processed on our servers and deleted after the operation completes."
          />
          <FAQItem
            q="Will DocSafe change my design?"
            a="No. We preserve your layout, slides, images, and styles. Only the text content is updated."
          />
          <FAQItem
            q="Can I process multiple files at once?"
            a="Yes. Upload multiple documents and download a single ZIP containing all the results."
          />
          <FAQItem q="Which formats are supported?" a="PDF, DOCX and PPTX." />
          <FAQItem
            q="Do I need to sign up to try it?"
            a="No. You can try DocSafe for free without creating an account (beta limits apply)."
          />
        </div>
      </section>
    </main>
  );
}

