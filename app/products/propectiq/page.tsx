import Link from "next/link";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-100">
      {children}
    </span>
  );
}

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

export default function ProspectIQPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* HERO */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="flex gap-2">
            <Badge>Coming soon</Badge>
            <Badge>In progress</Badge>
            <Badge>Teaser</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            ProspectIQ — Smart, personalized prospecting
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            ProspectIQ helps sales and business development teams scale personalized outreach
            without losing the human touch. Contextual, industry-tailored messages built with AI
            that adapts to your ICP.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/beta"
              className="rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-white hover:bg-yellow-600"
            >
              Join beta waitlist
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
            >
              Contact us
            </Link>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Currently under development · Launching later this year
          </div>
        </div>

        {/* Visual placeholder */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-yellow-100 to-orange-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
            <img
              src="/hero-illustration.png"
              alt="ProspectIQ preview"
              className="mx-auto h-[280px] w-auto opacity-60"
            />
            <p className="mt-2 text-center text-sm text-slate-500">Preview illustration</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">What ProspectIQ will bring</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Feature
            icon={<span className="text-2xl">🎯</span>}
            title="ICP-driven outreach"
            desc="Target the right accounts with context-aware personalization at scale."
          />
          <Feature
            icon={<span className="text-2xl">✍️</span>}
            title="Smart messaging"
            desc="AI-crafted intros, emails, and LinkedIn scripts adapted to each industry."
          />
          <Feature
            icon={<span className="text-2xl">📊</span>}
            title="Performance insights"
            desc="Track open rates, replies, and engagement to continuously improve campaigns."
          />
        </div>
      </section>

      {/* HOW IT WILL WORK */}
      <section className="mt-16 rounded-2xl border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">How it will work</h2>
        <ol className="mt-6 space-y-4 text-slate-700">
          <li><strong>1.</strong> Import your lead list (CSV, CRM, or LinkedIn).</li>
          <li><strong>2.</strong> Define ICP parameters (industry, role, region, size).</li>
          <li><strong>3.</strong> Generate AI-tailored messaging at scale.</li>
          <li><strong>4.</strong> Export or sync to your outbound tools.</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="mt-6 grid gap-4">
          <FAQ
            q="When will ProspectIQ be available?"
            a="We are currently building core features. Beta access is planned later this year. Join the waitlist to be notified."
          />
          <FAQ
            q="Who is ProspectIQ for?"
            a="Sales reps, SDRs, and business developers who need to scale outreach without losing personalization."
          />
          <FAQ
            q="How is this different from generic email tools?"
            a="ProspectIQ adapts messages based on industry and ICP parameters. It’s not just templates, but context-driven personalization."
          />
          <FAQ
            q="Will it integrate with CRMs?"
            a="Yes. Planned integrations include Salesforce, HubSpot, and LinkedIn automation tools."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/beta"
            className="rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-white hover:bg-yellow-600"
          >
            Join waitlist
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
          >
            Contact sales
          </Link>
        </div>
      </section>
    </div>
  );
}
