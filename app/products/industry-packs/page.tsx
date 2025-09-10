import Link from "next/link";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
    {children}
  </span>
);

const Card = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-2xl border p-6 transition hover:shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-slate-600">{desc}</p>
  </div>
);

const FAQ = ({ q, a }: { q: string; a: React.ReactNode }) => (
  <details className="group rounded-xl border p-5">
    <summary className="cursor-pointer list-none text-left font-semibold text-slate-900">
      <span className="mr-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">FAQ</span>
      {q}
      <span className="float-right text-slate-400 transition group-open:rotate-180">⌄</span>
    </summary>
    <div className="mt-3 text-slate-600">{a}</div>
  </details>
);

export default function IndustryPacksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* HERO */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="flex gap-2">
            <Badge>Coming soon</Badge>
            <Badge>Teaser</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Industry Packs — Specialized templates & automations
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Pre-built, industry-specific workflows that combine Mindorion tools, best-practice
            prompts, and guardrails—so teams can adopt AI faster with confidence.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/beta" className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
              Request early access
            </Link>
            <Link href="/contact" className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50">
              Talk to us
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-indigo-100 to-blue-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
            <img src="/hero-illustration.png" alt="Industry Packs preview" className="mx-auto h-[280px] w-auto opacity-70" />
            <p className="mt-2 text-center text-sm text-slate-500">Preview illustration</p>
          </div>
        </div>
      </section>

      {/* SAMPLE PACKS */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">Initial packs we’re exploring</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Card title="Consulting" desc="Client-ready docs, discovery templates, and QA scripts." />
          <Card title="Sales" desc="Outbound playbooks and proposal polishers that save hours." />
          <Card title="Education" desc="Course materials cleanup, rubric assistants, and summaries." />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="mt-6 grid gap-4">
          <FAQ q="What is an Industry Pack?" a="A curated set of templates, prompt patterns, and mini-automations tuned for a specific domain, built on top of Mindorion products." />
          <FAQ q="Will packs be customizable?" a="Yes. Packs are meant to be adapted to your processes and vocabulary." />
          <FAQ q="Which industries first?" a="We’re prioritizing Consulting, Sales, and Education based on early demand. Tell us your needs via the beta form." />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/beta" className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
            Request early access
          </Link>
          <Link href="/contact" className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50">
            Contact sales
          </Link>
        </div>
      </section>
    </div>
  );
}
