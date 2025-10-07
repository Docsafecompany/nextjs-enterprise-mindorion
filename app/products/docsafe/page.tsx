// app/products/docsafe/page.tsx
"use client";

import { useState } from "react";
import DocSafeUploader from "../../components/DocSafeUploader";
import Link from "next/link";

/* Helpers UI très simples */
function Step({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border text-lg">{icon}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-xs text-slate-500">{desc}</div>
    </div>
  );
}
function Benefit({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
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

export default function DocSafePage() {
  const FREE_LIMIT = 3;
  const [used, setUsed] = useState(0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Docsafe
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-slate-600">
          Protect your content, polish your style, and keep your layout intact. All in one click.
        </p>

        {/* Bloc compact : Choose file + Process & Download + Selected */}
        <div className="mt-6 flex justify-center">
          <DocSafeUploader
            compact
            showQuotaLine={false}
            freeLimit={FREE_LIMIT}
            onUsageUpdate={(n) => setUsed(n)}
          />
        </div>

        {/* Ligne globale sous le header */}
        <p className="mt-2 text-sm text-gray-500">
          No sign-up required · Free to use (beta) : {FREE_LIMIT} files. Used {Math.min(used, FREE_LIMIT)}/{FREE_LIMIT}
        </p>
      </div>

      {/* STEPS + BULLETS (sans dropzone à droite) */}
      <section className="mt-12 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Step icon="↑" title="1. Upload" desc="Select or drag & drop (PDF, DOCX, PPTX)" />
          <Step icon="✦" title="2. AI clean" desc="Remove hidden data & fix mistakes" />
          <Step icon="↓" title="3. Download" desc="Ready-to-share, layout preserved" />
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-1 text-sm text-slate-700 sm:grid-cols-2">
  <li>• <strong>Remove hidden data:</strong> comments, tracked changes, annotations, metadata</li>
  <li>• <strong>Correct text:</strong> spelling, grammar, punctuation</li>
  <li>• <strong>Preserve layout:</strong> tables, slides, images, and styles stay the same</li>
  <li>• <strong>Generate report:</strong> clear summary of all fixes and cleanups</li>
</ul>
      </section>

      {/* WHY USE DOCSAFE */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold">Why use DocSafe?</h2>
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

      {/* REVIEWS & FAQ */}
      <section className="mt-12">
        <div className="grid gap-4 md:grid-cols-3">
          <ReviewCard title="DocSafe Reviews" subtitle="44 reviews • ★★★★☆" />
          <ReviewCard title="Capterra" subtitle="23 ratings • ★★★★☆" />
          <ReviewCard title="Workspace Marketplace" subtitle="10,000,000+ users • ★★★★☆" />
        </div>

        <h3 className="mt-6 mb-3 text-xl font-bold text-slate-900">Frequently asked questions</h3>
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

      {/* CTAs Footer (compte / pricing) */}
      <section className="mt-10 flex items-center justify-center gap-3">
        <Link href="/sign-up" className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50">
          Create account
        </Link>
        <Link href="/pricing" className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50">
          See pricing
        </Link>
      </section>
    </main>
  );
}
