// app/products/docsafe/page.tsx
"use client";

import Link from "next/link";
import DocSafeUploader from "../../components/DocSafeUploader";

/* ---------- Small UI helpers ---------- */
function BenefitCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 px-4 py-5 md:px-5">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm text-slate-600">{children}</div>
    </div>
  );
}

function ReviewCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
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

/* ---------- Page ---------- */
export default function DocSafePage() {
  const openUploader = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const el = document.getElementById("uploader-box");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => window.dispatchEvent(new Event("docsafe:open-picker")), 250);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* HERO */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Upload your document
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-slate-600">
          Make your files error-free and secure in seconds — without changing the original layout.
        </p>

        <div className="mt-6 flex items-center justify-center">
          <a
            href="#uploader-box"
            onClick={openUploader}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Upload file
          </a>
        </div>
        <p className="mt-2 text-xs text-gray-500">No sign-up required · Free to use (beta)</p>
      </header>

      {/* 3 STEPS + DROPPER */}
      <section id="try" className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: steps + bullets */}
          <div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full border">
                  ↑
                </div>
                <div className="text-sm font-semibold text-slate-900">1. Upload</div>
                <div className="mt-1 text-xs text-slate-500">PDF, DOCX, or PPTX</div>
              </div>
              <div>
                <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full border">
                  ✦
                </div>
                <div className="text-sm font-semibold text-slate-900">2. AI clean</div>
                <div className="mt-1 text-xs text-slate-500">Remove metadata & mistakes</div>
              </div>
              <div>
                <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full border">
                  ↓
                </div>
                <div className="text-sm font-semibold text-slate-900">3. Download</div>
                <div className="mt-1 text-xs text-slate-500">Ready-to-share file</div>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li>• Remove hidden metadata & comments</li>
              <li>• Correct spelling & grammar</li>
              <li>• Preserve formatting & structure</li>
              <li>• Export multiple files in a ZIP</li>
            </ul>

            <div className="mt-4">
              <a
                href="#uploader-box"
                onClick={openUploader}
                className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Upload file
              </a>
              <p className="mt-2 text-xs text-gray-500">We don’t store files after processing.</p>
            </div>
          </div>

          {/* Right: uploader */}
          <div id="uploader-box">
            <DocSafeUploader />
          </div>
        </div>
      </section>

      {/* WHY USE DOCSAFE */}
      <section className="mt-10">
        <h2 className="text-center text-2xl font-bold">Why use DocSafe?</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <BenefitCard title="Professional result">
            Deliver documents that are free of errors and refined in style.
          </BenefitCard>
          <BenefitCard title="Time-saving">
            Let AI handle corrections in a fraction of the time.
          </BenefitCard>
          <BenefitCard title="Your data is safe">
            Files are processed securely and deleted after processing.
          </BenefitCard>
          <BenefitCard title="Layout preserved">
            Keep your tables, slides, images and styles untouched.
          </BenefitCard>
        </div>
      </section>

      {/* REVIEWS & FAQ (added right after “Why use DocSafe?”) */}
      <section className="mt-10">
        {/* Reviews row */}
        <div className="grid gap-4 md:grid-cols-3">
          <ReviewCard title="DocSafe Reviews" subtitle="44 reviews • ★★★★☆" />
          <ReviewCard title="Capterra" subtitle="23 ratings • ★★★★☆" />
          <ReviewCard title="Workspace Marketplace" subtitle="10,000,000+ users • ★★★★☆" />
        </div>

        {/* FAQ */}
        <h3 className="mt-6 mb-3 text-xl font-bold text-slate-900">Frequently asked questions</h3>
        <div className="space-y-3">
          <FAQItem
            q="Will my original formatting be preserved?"
            a="Yes. Your layout, images, tables and slides remain the same. We only update the text content."
          />
          <FAQItem
            q="Which formats are supported?"
            a="PDF, DOCX and PPTX. You can export back to the same format or download a ZIP for multiple files."
          />
          <FAQItem
            q="Do you store my files?"
            a="No. Files are processed server-side and deleted after the operation completes."
          />
          <FAQItem
            q="What about metadata?"
            a="We remove hidden properties like author, comments, revisions and sensitive custom fields before export."
          />
          <FAQItem
            q="How do I start?"
            a={
              <>
                Click{" "}
                <a href="#uploader-box" className="text-indigo-600 underline" onClick={openUploader}>
                  Upload file
                </a>{" "}
                above, drop your document, then click <b>Process &amp; Download</b>.
              </>
            }
          />
        </div>
      </section>

      {/* No bottom Upload button anymore */}
      <section className="mt-10 flex items-center justify-center gap-3">
        <Link
          href="/sign-up"
          className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          Create account
        </Link>
        <Link
          href="/pricing"
          className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          See pricing
        </Link>
      </section>
    </main>
  );
}

