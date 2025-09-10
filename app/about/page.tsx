export const metadata = {
  title: "About Us • Mindorion",
  description:
    "Mindorion builds pragmatic AI tools for real work—DocSafe, ProspectIQ and Industry Packs.",
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border p-5 text-center">
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

function ValueCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-6 transition hover:shadow-sm">
      <div className="h-9 w-9">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-xl border p-5">
      <summary className="cursor-pointer list-none text-left font-semibold text-slate-900">
        <span className="mr-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          FAQ
        </span>
        {q}
        <span className="float-right text-slate-400 transition group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="mt-3 text-slate-600">{a}</div>
    </details>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* HERO */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>Independent</Badge>
            <Badge>Privacy-minded</Badge>
            <Badge>Beta in progress</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            About Mindorion
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            We build pragmatic AI tools that fit your workflow instead of forcing
            you into ours. Our first products are{" "}
            <strong>DocSafe</strong> (document correction & rephrasing while
            preserving layout), <strong>ProspectIQ</strong> (personalized
            prospecting at scale) and <strong>Industry Packs</strong> (domain-specific
            templates & automations).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/products/docsafe"
              className="rounded-xl bg-black px-5 py-2.5 font-semibold text-white hover:opacity-90"
            >
              Try DocSafe
            </a>
            <a
              href="/beta"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
            >
              Join the beta
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-indigo-100 to-blue-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
            <img
              src="/hero-illustration.png" // change to .svg if that's your asset
              alt="Mindorion preview"
              className="mx-auto h-[300px] w-auto"
            />
            <p className="mt-2 text-center text-sm text-slate-500">
              Our products are designed to feel simple, fast and reliable.
            </p>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        <Stat value="3" label="Products in the portfolio" />
        <Stat value="Beta" label="Free, no signup for DocSafe" />
        <Stat value="Privacy" label="Minimal processing during beta" />
      </section>

      {/* STORY */}
      <section className="mt-16 rounded-2xl border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Our story</h2>
        <p className="mt-4 max-w-3xl text-slate-600">
          Mindorion started with a simple observation: professionals spend more
          time fighting formatting and glue-work than doing actual high-value
          work. We ship focused tools that automate the busywork and keep you in
          control of quality, privacy, and layout. No fluff—just outcomes.
        </p>
      </section>

      {/* VALUES */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">Values</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <ValueCard
            icon={<span className="text-2xl">🧭</span>}
            title="Pragmatism"
            desc="We prefer shipping small, useful tools over grand platforms."
          />
          <ValueCard
            icon={<span className="text-2xl">🔒</span>}
            title="Trust"
            desc="We minimize data retention and design with privacy in mind."
          />
          <ValueCard
            icon={<span className="text-2xl">⚡</span>}
            title="Clarity"
            desc="Clear UX, deterministic flows, and predictable results."
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mt-16 rounded-2xl border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Timeline</h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          <li>
            <strong>Now:</strong> DocSafe public beta (free, no signup).
          </li>
          <li>
            <strong>Soon:</strong> ProspectIQ and Industry Packs teasers; early
            access cohorts.
          </li>
          <li>
            <strong>Later:</strong> Enterprise options (SSO, audit, private hosting).
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="mt-6 grid gap-4">
          <FAQ
            q="Is Mindorion a single product or a suite?"
            a="Mindorion is the parent brand. The suite currently includes DocSafe, ProspectIQ (teaser) and Industry Packs (teaser)."
          />
          <FAQ
            q="How do you handle data during beta?"
            a="We keep minimal data required to process a request and fix issues. Avoid uploading sensitive content you’re not allowed to share."
          />
          <FAQ
            q="Do you offer enterprise plans?"
            a="Yes—coming later: SSO, private deployments, and custom SLAs. Contact us to discuss."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl border p-6 md:p-8">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Want to collaborate or pilot Mindorion?
            </h3>
            <p className="mt-2 text-slate-600">
              We’re looking for early partners across consulting, sales, and
              education. Tell us about your workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="/contact"
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-900 hover:bg-slate-50"
            >
              Contact sales
            </a>
            <a
              href="/beta"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Join the beta
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
