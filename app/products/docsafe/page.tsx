// app/products/docsafe/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import DocSafeUploader from "../../components/DocSafeUploader";
import Link from "next/link";

/* Small UI helpers */
function Step({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
      <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-indigo-50 text-base">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</div>
      </div>
    </div>
  );
}

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
        <span className="grid h-6 w-6 place-items-center rounded-md bg-indigo-50 text-sm">{icon}</span>
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

/* Feedback after download */
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
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send feedback");
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
        <button onClick={onClose} className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50">
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

export default function DocSafePage() {
  const FREE_LIMIT = 3;
  const [used, setUsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // client-only plan (no Clerk import here)
  const [plan, setPlan] = useState<string>("free");
  useEffect(() => {
    const fromWindow = (typeof window !== "undefined" && (window as any).__USER_PLAN__) || "";
    const fromLS = typeof window !== "undefined" ? localStorage.getItem("plan") || "" : "";
    const p = String(fromWindow || fromLS || "free").toLowerCase();
    setPlan(p);
  }, []);
  const isPaid = useMemo(() => plan === "starter" || plan === "pro", [plan]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">DocSafe</h1>
        <p className="mx-auto mt-3 max-w-3xl text-slate-600">
          Protect your content, polish your style, and keep your layout intact. All in one click.
        </p>
      </div>

      {/* UPLOADER + STEPS (side-by-side on md+) */}
      <section className="mt-6 grid gap-6 md:grid-cols-[1fr,320px]">
        {/* Uploader card */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex justify-center">
            <DocSafeUploader
              compact
              showQuotaLine={false}
              freeLimit={FREE_LIMIT}
              onUsageUpdate={(n) => setUsed(n)}
              // Ces props sont ignorées si ton composant ne les supporte pas : pas bloquant
              // @ts-expect-error optional
              isPaid={isPaid}
              // @ts-expect-error optional
              onDownloadComplete={() => setShowFeedback(true)}
            />
          </div>

          {/* Free limit — made prominent with CTA */}
          <div className="mt-3 flex flex-col items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 sm:flex-row">
            <p className="text-sm">
              <span className="font-semibold text-indigo-700">Free to use (beta)</span>: {FREE_LIMIT} files.&nbsp;
              Used <span className="font-semibold text-slate-900">{Math.min(used, FREE_LIMIT)}/{FREE_LIMIT}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Upgrade to Premium
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-white/60"
              >
                Create account
              </Link>
            </div>
          </div>

          {/* Feedback (after download) */}
          <FeedbackBox visible={showFeedback} onClose={() => setShowFeedback(false)} />
        </div>

        {/* Steps column (compact & vertical) */}
        <aside className="space-y-3">
          <Step icon="↑" title="1. Upload" desc="Select or drag & drop (PDF, DOCX, PPTX)" />
          <Step icon="✦" title="2. AI clean" desc="Remove hidden data & fix mistakes" />
          <Step icon="↓" title="3. Download" desc="Ready-to-share, layout preserved" />
        </aside>
      </section>

      {/* WHY + REVIEWS (social proof moved up) */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold">Why use DocSafe?</h2>

        {/* Social proof first */}
        <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-3">
          <ReviewCard title="DocSafe Reviews" subtitle="44 reviews • ★★★★☆" />
          <ReviewCard title="Capterra" subtitle="23 ratings • ★★★★☆" />
          <ReviewCard title="Workspace Marketplace" subtitle="10,000,000+ users • ★★★★☆" />
        </div>

        {/* Benefits */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Benefit icon="🛡️" title="Privacy & Security">
            Files are processed securely and deleted after processing. We never use your data to train models.
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

      {/* FAQ */}
      <section className="mt-12">
        <h3 className="mb-3 text-xl font-bold text-slate-900">Frequently asked questions</h3>
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

      {/* Strong CTAs at the end */}
      <section className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/sign-up"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Create account
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          See pricing
        </Link>
      </section>
    </main>
  );
}
