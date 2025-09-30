"use client";

import Link from "next/link";
// ⬇️ use RELATIVE path so it works without tsconfig paths
import DocSafeUploader from "../../components/DocSafeUploader";

/* helper */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border px-4 py-5 md:px-5">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm text-slate-600">{children}</div>
    </div>
  );
}

export default function DocSafePage() {
  const openUploader = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const el = document.getElementById("uploader-box");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => window.dispatchEvent(new Event("docsafe:open-picker")), 300);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* HERO */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Upload. Clean. Correct.<br className="hidden sm:block" /> Export.
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-slate-600">
          Improve your documents (PDF, DOCX, PPTX) in seconds — without changing the original layout.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="#try"
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Try DocSafe Free
          </a>
          <Link
            href="/sign-up"
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>

        <p className="mt-2 text-xs text-gray-500">No credit card required • Free beta access</p>
      </header>

      {/* TRY IT NOW */}
      <section id="try" className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: bullets + CTA that opens the picker on the right */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Try it now</h2>
            <p className="mt-2 text-sm text-slate-600">
              Upload a file (PDF, DOCX, PPTX). We’ll clear hidden data, fix grammar, and keep your
              layout intact. Export as ZIP/PDF/DOCX/PPTX.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Remove hidden metadata & comments</li>
              <li>• Correct spelling & grammar</li>
              <li>• Keep formatting & structure</li>
              <li>• Export multiple files in a ZIP</li>
            </ul>

            <div className="mt-4">
              <a
                href="#uploader-box"
                onClick={openUploader}
                className="inline-flex items-center rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Upload file
              </a>
              <p className="mt-2 text-xs text-gray-500">Free beta limit: 3 files (anonymous)</p>
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
        <h2 className="text-2xl font-bold">Why use DocSafe?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card title="Security & Confidentiality">
            Removes hidden data (authors, comments, revisions, sensitive properties) to prevent accidental leaks.
          </Card>
          <Card title="Grammar & spelling correction">
            Corrects and reformats text for a clear, professional result.
          </Card>
          <Card title="Save Time">
            Upload, clean, and export with one click — no juggling multiple tools.
          </Card>
          <Card title="Simplicity & Peace of Mind">
            Keep your formatting, images, and tables untouched.
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="mt-4 grid gap-4 text-sm md:grid-cols-4">
          <li className="rounded-2xl border p-4">
            <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold">1</span>
            Upload a file (PDF, DOCX, PPTX).
          </li>
          <li className="rounded-2xl border p-4">
            <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold">2</span>
            DocSafe processes it in the background.
          </li>
          <li className="rounded-2xl border p-4">
            <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold">3</span>
            Export multiple files in a ZIP.
          </li>
          <li className="rounded-2xl border p-4">
            <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold">4</span>
            Download your clean files (ZIP, PDF, DOCX, PPTX).
          </li>
        </ol>

        {/* centered CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#try"
            onClick={openUploader}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Try DocSafe Now
          </a>
          <Link
            href="/sign-up"
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}


