import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Link from "next/link";

export default function Page() {
  return (
    <>
      {/* HERO with watermark logo */}
      <section className="relative mx-auto mt-20 max-w-5xl px-5 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          <img
            src="/logo-mindorion.png"
            alt="Mindorion logo"
            className="w-[520px] max-w-full h-auto"
          />
        </div>

        <h1 className="relative text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Empowering Work with <span className="text-indigo-600">Mindorion</span>
        </h1>
        <p className="relative mt-4 text-lg text-slate-600">
          Smart, human-centered software for freelancers, students, and small
          businesses. Optimize productivity and collaboration with tools built
          for the future of work.
        </p>

        <div className="relative mt-8 flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            Sign up
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-slate-300 px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
          >
            About Us
          </Link>
        </div>
      </section>

      {/* Products section */}
      <section className="mx-auto mt-16 max-w-7xl px-5 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our First Tools</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* DocSafe: active card */}
          <ProductCard
            title="DocSafe"
            description="Clean, correct, and rephrase your documents (PDF, Word, PowerPoint) without breaking their layout, while removing hidden risks."
            href="/products/docsafe"
          />

          {/* ProspectIQ: disabled/teaser */}
          <div className="opacity-40 pointer-events-none select-none">
            <ProductCard
              title="ProspectIQ"
              description="(Teaser) Contextual, industry-tailored outreach at scale."
              href="#"
            />
          </div>

          {/* Industry Packs: disabled/teaser */}
          <div className="opacity-40 pointer-events-none select-none">
            <ProductCard
              title="Industry Packs"
              description="(Teaser) Specialized templates & automations, industry workflows to save time. Adopt best practices instantly with templates."
              href="#"
            />
          </div>
        </div>

        {/* ===== iLovePDF-style banner ===== */}
        <div className="mt-20 space-y-8">
          {/* Premium banner with Pricing button */}
          <div className="rounded-2xl bg-amber-50/80 ring-1 ring-amber-100 p-6 md:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Get more with <span className="text-indigo-600">Mindorion</span> Premium
                </h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Full access to our upcoming tools & industry packs.</li>
                  <li>Priority compute & quicker support.</li>
                  <li>Early features and private betas.</li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center rounded-xl bg-amber-400 px-5 py-2.5 font-semibold text-slate-900 shadow-sm hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                See Pricing
              </Link>
            </div>
          </div>

          {/* DocSafe featured card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-[280px,1fr,auto] md:items-center">
              {/* Replace the gray placeholder with an actual image from /public */}
              <img
                src="/docsafeexemple.png"   /* put the file in public/docsafeexemple.png */
                alt="DocSafe example"
                className="mx-auto md:mx-0 h-40 md:h-44 w-full max-w-[280px] rounded-xl ring-1 ring-slate-300/60 object-cover"
              />

              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-slate-900">
                  Image & document editing made simple with{" "}
                  <span className="text-indigo-600">DocSafe</span>
                </h4>
                <p className="text-slate-600">
                  Clean, correct, and rephrase content while preserving layout. Work on PDF,
                  Word, and PowerPoint in one place. Secure by design and built for teams.
                </p>
                <p className="text-slate-500">
                  Try it free during beta and share your feedback with us.
                </p>
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
        </div>
        {/* ===== End ===== */}
      </section>
    </>
  );
}


