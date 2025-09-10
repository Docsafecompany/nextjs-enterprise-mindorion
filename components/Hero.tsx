import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
      {/* Left copy */}
      <div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Empower your creativity
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Unlock the potential of your ideas with Mindorion’s pragmatic AI tools.
          Start with <span className="font-semibold text-slate-800">DocSafe</span> to correct and rephrase
          documents while preserving layout.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products/docsafe"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700"
          >
            Get started
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-800 hover:bg-slate-50"
          >
            Learn more
          </Link>
        </div>

        {/* 3 features */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border p-5 text-center">
            <img src="/icons/correct.svg" className="mx-auto h-8 w-8" alt="" />
            <h3 className="mt-3 font-semibold">Innovative Products</h3>
            <p className="mt-1 text-sm text-slate-600">Cutting-edge solutions for real workflows.</p>
          </div>
          <div className="rounded-xl border p-5 text-center">
            <img src="/icons/rephrase.svg" className="mx-auto h-8 w-8" alt="" />
            <h3 className="mt-3 font-semibold">AI Assistance</h3>
            <p className="mt-1 text-sm text-slate-600">Boost productivity with pragmatic AI.</p>
          </div>
          <div className="rounded-xl border p-5 text-center">
            <img src="/icons/layout.svg" className="mx-auto h-8 w-8" alt="" />
            <h3 className="mt-3 font-semibold">Vibrant Community</h3>
            <p className="mt-1 text-sm text-slate-600">Share feedback and shape the roadmap.</p>
          </div>
        </div>
      </div>

      {/* Right illustration */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-indigo-100 to-blue-100 blur-2xl" />
        <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
          <img src="/hero-illustration.png" alt="Mindorion UI" className="mx-auto h-[300px] w-auto" />
        </div>
      </div>
    </section>
  );
}
