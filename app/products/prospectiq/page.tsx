import Link from "next/link";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-100">
    {children}
  </span>
);

const Card = ({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-2xl border p-6 transition hover:shadow-sm">
    {icon ? <div className="h-10 w-10">{icon}</div> : null}
    <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
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
            Scale outreach without losing the human touch. Context-aware messages by industry, role,
            and ICP—crafted in seconds, at volume.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/beta" className="rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-white hover:bg-yellow-600">
              Join waitlist
            </Link>
            <Link href="/contact" className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50">
              Contact sales
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">Launching later this year · Beta invites in waves</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-yellow-100 to-orange-100 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
            <img src="/hero-illustration.png" alt="ProspectIQ preview" className="mx-auto h-[280px] w-auto opacity-70" />
            <p className="mt-2 text-center text-sm text-slate-500">Preview illustration</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">What ProspectIQ will bring</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Card title="ICP-driven targeting" desc="Choose industry, role, region, and firmographics. Messages adapt accordingly." icon={<span className="text-2xl">🎯</span>} />
          <Card title="AI messaging at scale" desc="Personalized intros, emails, and LinkedIn scripts with context—no generic templates." icon={<span className="text-2xl">✍️</span>} />
          <Card title="Insights & iteration" desc="See what resonates (opens, replies), learn, and iterate quickly." icon={<span className="text-2xl">📊</span>} />
        </div>
      </section>

      {/* HOW IT WILL WORK */}
      <section className="mt-16 rounded-2xl border p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">How it will work</h2>
        <ol className="mt-6 space-y-4 text-slate-700">
          <li><strong>1.</strong> Import prospects (CSV / CRM / LinkedIn).</li>
          <li><strong>2.</strong> Define ICP parameters and value props.</li>
          <li><strong>3.</strong> Generate channel-ready messages (email, LinkedIn).</li>
          <li><strong>4.</strong> Export or sync to your outbound stack.</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="mt-6 grid gap-4">
          <FAQ q="When is the beta?" a="We are building core features now. Join the waitlist to be notified as cohorts open." />
          <FAQ q="Who is it for?" a="SDRs, AEs, and founders who need repeatable, high-quality outreach without heavy manual editing." />
          <FAQ q="How is this different from templates?" a="ProspectIQ generates context-aware messages using your ICP and industry signals—not one-size-fits-all prompts." />
          <FAQ q="Will it integrate with CRM tools?" a="Planned: Salesforce, HubSpot, and common LinkedIn automation tools." />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/beta" className="rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-white hover:bg-yellow-600">
            Join waitlist
          </Link>
          <Link href="/contact" className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50">
            Contact sales
          </Link>
        </div>
      </section>
    </div>
  );
}
