import Link from "next/link";

/** Small pill used for tags/badges */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
      {children}
    </span>
  );
}

/** Re-usable feature card */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border p-6 hover:shadow-sm transition">
      <div className="h-10 w-10">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  );
}

/** Simple step row */
function Step({
  number,
  title,
  desc,
}: {
  number: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
        {number}
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

/** Accessible FAQ item (no JS) */
function FAQ({
  q,
  a,
}: {
  q: string;
  a: React.ReactNode;
}) {
  return (
    <details className="group rounded-xl border p-5">
      <summary className="cursor-pointer list-none text-left font-semibold text-slate-900">
        <span className="mr-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">FAQ</span>
        {q}
        <span className="float-right text-slate-400 transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-3 text-slate-600">{a}</div>
    </details>
  );
}

export default function DocSafePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* HERO */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="flex gap-2">
            <Badge>PDF · DOCX · PPTX</Badge>
            <Badge>Beta · Free</Badge>
            <Badge>No signup</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            DocSafe — Correct & Rephrase without breaking layout
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            V1: grammar & spelling. V2: style & clarity. Keeps your document
            formatting intact—so you can deliver polished work in minutes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://YOUR_DOCSAFE_URL"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Try it free
            </a>
            <Link
              href="/beta"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
            >
              Leave feedback
            </Link>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Works best with English/French documents · Exports to the same format
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-indigo-100 to-blue-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
            <img
              src="/hero-illustration.png" // or .svg if you uploaded that
              alt="DocSafe UI"
              className="mx-auto h-[320px] w-auto"
            />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / QUICK BENEFITS */}
      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        <Feature
          icon={<img src="/icons/correct.svg" alt="" className="h-10 w-10" />}
          title="Automatic correction"
          desc="Instant grammar, spelling, and basic consistency checks."
        />
        <Feature
          icon={<img src="/icons/rephrase.svg" alt="" className="h-10 w-10" />}
          title="Rephrase & style"
          desc="Improve tone and clarity; keep your voice with gentle rewrites."
        />
        <Feature
          icon={<img src="/icons/layout.svg" alt="" className="h-10 w-10" />}
          title="Layout preserved"
          desc="Your Word/PDF/PowerPoint stays intact—no messy copy-paste."
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-16 rounded-2xl border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Step
            number={1}
            title="Upload"
            desc="Drop a PDF, Word, or PowerPoint. No account required during beta."
          />
          <Step
            number={2}
            title="Choose V1 or V2"
            desc="V1 corrects grammar & spelling; V2 rephrases for style & clarity."
          />
          <Step
            number={3}
            title="Download"
            desc="Get your file back with the formatting preserved. Review & ship."
          />
        </div>
      </section>

      {/* COMPARISON */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">Why DocSafe vs. copy-paste into a chatbot?</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold text-slate-900">With DocSafe</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              <li>Preserves original layout and styles</li>
              <li>Handles long/complex documents reliably</li>
              <li>Exports to the same format (PDF/DOCX/PPTX)</li>
              <li>Simple, deterministic flows (V1 & V2)</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold text-slate-900">Generic chatbot workflow</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              <li>Manual copy-paste breaks formatting</li>
              <li>Token limits on long files</li>
              <li>Time lost reformatting the output</li>
              <li>Inconsistent prompts & results</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="mt-6 grid gap-4">
          <FAQ
            q="What file types are supported?"
            a="PDF, DOCX, and PPTX. Export returns the same format you uploaded."
          />
          <FAQ
            q="Is there any signup or payment during beta?"
            a="No. The beta is free and does not require registration. We only ask for feedback."
          />
          <FAQ
            q="How is my data handled?"
            a={
              <>
                Minimal data is kept only to process your request and troubleshoot errors during beta.
                We purge processing artifacts on a schedule. Do not upload content you are not
                authorized to share. See <a className="text-indigo-600 underline" href="/legal/privacy">Privacy</a>.
              </>
            }
          />
          <FAQ
            q="When should I use V1 vs. V2?"
            a="Use V1 for fast grammar/spelling checks. Use V2 when you want clearer, more professional wording (emails, reports, proposals)."
          />
          <FAQ
            q="Any limits?"
            a="Large files are supported within reasonable size limits during beta. If something fails, please try a smaller file and send us the case on the beta form."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://YOUR_DOCSAFE_URL"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
          >
            Try DocSafe free
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
