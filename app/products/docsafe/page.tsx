// app/products/docsafe/page.tsx
import Link from "next/link";
import DocSafeUploader from "../../components/DocSafeUploader";

/* --- Small utility components --- */

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Step({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
        {num}
      </div>
      <div className="font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="mb-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600/10 text-indigo-700">
        ●
      </div>
      <div className="font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-xl border p-5">
      <summary className="cursor-pointer list-none text-left font-medium text-slate-900">
        <span className="mr-2 text-slate-400 transition group-open:rotate-180">▾</span>
        {q}
      </summary>
      <div className="mt-3 text-slate-600">{a}</div>
    </details>
  );
}

/* --- Page --- */

export default function DocSafePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
      {/* HERO — direct & explicit */}
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          DocSafe — Smarter, Safer Documents
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          V1 cleans metadata and corrects spelling/grammar. V2 builds on V1 by rephrasing text
          for clarity — always preserving your original formatting.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <a
            href="#uploader"
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Try DocSafe Free
          </a>
          <Link
            href="/pricing"
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            See Pricing
          </Link>
        </div>
      </header>

      {/* Uploader panel */}
      <section
        id="uploader"
        className="mx-auto mt-6 max-w-5xl rounded-2xl border bg-white/70 p-4 shadow-sm md:p-6"
      >
        {/* Your uploader stays as-is, just framed nicely */}
        <DocSafeUploader />

        {/* Quick stats (social proof) */}
        <div className="mt-6 grid grid-cols-3 gap-4 md:gap-6">
          <Stat value="48,148" label="documents processed" />
          <Stat value="5,814" label="rephrased with V2" />
          <Stat value="4,314" label="ZIPs delivered" />
        </div>
      </section>

      {/* 4 steps — clear mental model */}
      <section className="mx-auto mt-8 max-w-5xl">
        <div className="grid gap-4 md:grid-cols-4">
          <Step
            num="01"
            title="Upload"
            desc="From computer or cloud drive. PDF, DOCX, PPTX supported."
          />
          <Step
            num="02"
            title="Configure"
            desc="Pick V1 (Clean) or V2 (Rephrase). Use Strict PDF to strip noisy hidden layers."
          />
          <Step
            num="03"
            title="Review"
            desc="Formatting is preserved. For DOCX/PPTX we inject text back into the same styles."
          />
          <Step
            num="04"
            title="Export"
            desc="Download as original format or get a ZIP with multiple files."
          />
        </div>
      </section>

      {/* Benefits focused on PDF editing */}
      <section className="mt-14">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          PDF & document cleanup made simple
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Feature
            title="Metadata & layout safe"
            desc="Remove hidden metadata from PDFs and keep original Word/PowerPoint layout intact."
          />
          <Feature
            title="AI Cleaning & Correction (V1)"
            desc="Clean hidden data, fix spelling, grammar, and punctuation without altering the meaning."
          />
          <Feature
            title="AI Rewriting (V2)"
            desc="Builds on V1 by rephrasing text for clarity and fluency while preserving intent and style."
          />
          <Feature
            title="Strict PDF option"
            desc="Strip hidden/bitmap layers (e.g., OCR leftovers) to improve extraction before AI."
          />
          <Feature
            title="Formatting preserved"
            desc="For DOCX/PPTX, only the text changes; styles, lists and layouts remain consistent."
          />
          <Feature
            title="Multi-file ZIP output"
            desc="Process multiple files at once and receive a single ZIP with all results."
          />
        </div>
      </section>

      {/* Small trust badges (optional) */}
      <section className="mx-auto mt-6 max-w-5xl">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border p-4 text-sm">
            <div className="font-semibold text-slate-900">DocSafe Reviews</div>
            <div className="text-slate-500">44 reviews • ★★★★☆</div>
          </div>
          <div className="rounded-xl border p-4 text-sm">
            <div className="font-semibold text-slate-900">Capterra</div>
            <div className="text-slate-500">23 ratings • ★★★★☆</div>
          </div>
          <div className="rounded-xl border p-4 text-sm">
            <div className="font-semibold text-slate-900">Workspace Marketplace</div>
            <div className="text-slate-500">10,000,000+ users • ★★★★☆</div>
          </div>
        </div>
      </section>

      {/* FAQ — short & practical */}
      <section className="mx-auto mt-14 max-w-5xl">
        <h3 className="mb-4 text-xl font-bold text-slate-900">Frequently asked questions</h3>
        <div className="grid gap-3">
          <FAQ
            q="What's the difference between V1 and V2?"
            a="V1 corrects grammar/spelling/punctuation; V2 rewrites sentences for clarity while preserving meaning and tone."
          />
          <FAQ
            q="Will my original formatting be preserved?"
            a="Yes. For DOCX and PPTX we re-inject the AI result back into the same styles. For PDF we keep layout intact as much as possible."
          />
          <FAQ
            q="What does Strict PDF do?"
            a="It strips noisy hidden layers (e.g., OCR leftovers) before AI so the output is cleaner and more deterministic."
          />
          <FAQ q="Which formats are supported?" a="PDF, DOCX, PPTX — export returns the same format you uploaded." />
          <FAQ q="Does DocSafe fix weird tokens like “gggggggigital”?" a="Yes — both V1 and V2 catch common OCR glitches and non-words." />
          <FAQ
            q="How do I start the process?"
            a={
              <>
                Go to the uploader above or{" "}
                <a href="#uploader" className="text-indigo-600 underline">
                  click here
                </a>
                , drop your file, choose V1 or V2, then export.
              </>
            }
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#uploader"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Select a document
          </a>
          <Link
            href="/beta"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
          >
            Share feedback
          </Link>
          <Link
            href="/security"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
          >
            Security practices
          </Link>
        </div>
      </section>
    </div>
  );
}



