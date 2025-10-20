import ProductCard from "../components/ProductCard";
import Link from "next/link";

export default function Page() {
  return (
    <>
      {/* HERO with watermark logo */}
      <section className="relative mx-auto mt-16 md:mt-20 max-w-5xl px-5 text-center">
        {/* watermark hidden on very small screens */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center opacity-10 sm:flex">
          <img src="/logo-mindorion.png" alt="Mindorion logo" className="w-[520px] max-w-full h-auto" />
        </div>

        <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Empowering Work with <span className="text-indigo-600">Mindorion</span>
        </h1>
        <p className="relative mt-4 text-base sm:text-lg text-slate-600">
          Smart, human-centered software for freelancers, students, and small businesses.
          Optimize productivity and collaboration with tools built for the future of work.
        </p>

        {/* Primary CTA: stacked on mobile */}
        <div className="relative mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/products/docsafe"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-white font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Go to DocSafe
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-300 px-6 py-3 text-center text-slate-900 font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
          >
            See Pricing
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto mt-16 max-w-7xl px-5 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our First Tools</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* DocSafe: active card */}
          <ProductCard
            title="DocSafe"
            description="Clean, correct and rephrase your documents (PDF, Word, PowerPoint) without breaking the layout. Remove hidden risks and export in seconds."
            href="/products/docsafe"
          />

          {/* ProspectIQ: teaser + unified CTA to waitlist */}
          <div className="opacity-70">
            <ProductCard
              title="ProspectIQ"
              description="Personalized outreach at scale. Enrich leads, craft context-aware messages, and sync with your CRM — without manual grunt work."
              href="/waitlist"
            />
            <p className="mt-2 text-xs text-slate-500 text-center">Coming soon · Join the waitlist</p>
          </div>

          {/* Industry Packs: teaser + unified CTA to waitlist */}
          <div className="opacity-70">
            <ProductCard
              title="Industry Packs"
              description="Ready-to-use templates, checklists and automations for your sector (sales, legal, education, HR…). Apply best practices in minutes."
              href="/waitlist"
            />
            <p className="mt-2 text-xs text-slate-500 text-center">Coming soon · Join the waitlist</p>
          </div>
        </div>

        {/* — Move DocSafe value section up (right after products) — */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[280px,1fr,auto] md:items-center">
            <img
              src="/docsafeexemple.png"
              alt="DocSafe example"
              className="mx-auto md:mx-0 h-40 md:h-44 w-full max-w-[280px] rounded-xl ring-1 ring-slate-300/60 object-cover"
            />
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-slate-900">
                Why teams love <span className="text-indigo-600">DocSafe</span>
              </h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                <li>Preserves tables, slides, images and brand styles.</li>
                <li>Removes metadata & comments to share files safely.</li>
                <li>Works on PDF, Word and PowerPoint — no format anxiety.</li>
              </ul>
              <blockquote className="text-sm text-slate-500 border-l-2 border-slate-200 pl-3">
                “We cut review cycles by 60% without breaking layouts.” — Early beta user
              </blockquote>
            </div>

            <div className="justify-self-start md:justify-self-end">
              <Link
                href="/products/docsafe"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Go to DocSafe
              </Link>
            </div>
          </div>
        </div>

        {/* Premium benefits (kept, but now below DocSafe value) */}
        <div className="mt-12 rounded-2xl bg-amber-50/80 ring-1 ring-amber-100 p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Get more with <span className="text-indigo-600">Mindorion</span> Premium
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                <li>Finish reviews faster: batch-process documents in one click.</li>
                <li>Eliminate rework: export clean files that keep the layout intact.</li>
                <li>Access upcoming tools (ProspectIQ, Industry Packs) as soon as they drop.</li>
                <li>Priority processing & support when time is critical.</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-xl bg-amber-400 px-5 py-2.5 font-semibold text-slate-900 shadow-sm hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                See Pricing
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-xl border px-5 py-2.5 font-semibold hover:bg-white/60"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


