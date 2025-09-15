// app/pricing/page.tsx
import Link from "next/link";

type Plan = {
  title: string;
  price: string;
  cadence: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
  ctaHref: string;
  ctaLabel: string;
  footer?: string;
};

const plans: Plan[] = [
  {
    title: "Free Plan",
    price: "$0",
    cadence: "forever",
    features: [
      "1 user",
      "PDF, DOCX, PPTX support",
      "V1: metadata cleaning (PDF), spelling/grammar, spacing & punctuation",
      "Strict PDF option (remove hidden/invisible text)",
      "Formatting preserved (Word/PowerPoint styles intact)",
      "Batch: 1 file per job, ZIP output",
      "HTML report with changes",
      "Limits: 50 MB/file, 100 pages/day, 500 pages/month, 5 jobs/day",
      "Download links valid 1h",
      "Community support",
      "“Powered by DocSafe” in report",
    ],
    ctaHref: "/products/docsafe",
    ctaLabel: "Select",
    footer: "Great for trying DocSafe",
  },
  {
    title: "Starter",
    price: "$15",
    cadence: "per month",
    badge: "30 Day Free Trial",
    highlight: true,
    features: [
      "1 user",
      "Everything in Free",
      "Queue priority, faster processing",
      "Batch: up to 10 files per job",
      "V2 rephrase: unlimited (within monthly pages)",
      "File size up to 150 MB",
      "Quotas: 5,000 pages/month, 200 jobs/day",
      "Remove “Powered by” + add your logo",
      "Download links valid 7 days",
      "AI settings: tone, default language, mini glossary (100 terms)",
      "Email support (24–48h)",
      "30-day free trial",
    ],
    ctaHref: "/sign-up?plan=starter",
    ctaLabel: "Start Free Trial",
    footer: "Best for individuals",
  },
  {
    title: "Pro",
    price: "$40",
    cadence: "per month",
    features: [
      "Up to 5 users included (extra seats $8/user/mo)",
      "Everything in Starter",
      "Batch: up to 50 files per job",
      "File size up to 300 MB",
      "Quotas: 25,000 pages/month, 500 jobs/day",
      "Team workspace: roles, shared folders",
      "Analytics: usage, processing time, V1/V2 ratio",
      "API & Webhooks, per-project API keys",
      "Branding+: logo & colors, custom share domain (CNAME)",
      "Security: basic audit log, Google SSO",
      "Model choice per job: gpt-4o / gpt-4o-mini",
      "Priority support (<24h), best-effort 99.9% SLA",
    ],
    ctaHref: "/contact?plan=pro",
    ctaLabel: "Select",
    footer: "For small teams & power users",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple pricing for every team
        </h1>
        <p className="mt-3 text-slate-600">
          Clean, correct, and rephrase documents at scale — with layout preserved.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.title} {...p} />
          ))}
        </div>

        {/* Add-ons */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Add-ons</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
            <li>Page packs (1k / 5k / 25k pages)</li>
            <li>Overages billed per 1,000 pages</li>
            <li>Dedicated region (EU/US) & KMS encryption</li>
            <li>Enterprise: SSO SAML, DPA, advanced audit, Private/VPC, onboarding</li>
          </ul>
        </div>

        {/* Notes / fair use */}
        <div className="mx-auto mt-8 max-w-4xl text-xs leading-relaxed text-slate-500">
          <p>
            <strong>Notes.</strong> “Pages” count the total extracted text before AI
            (multi-layer PDFs may increase logical pages). Password-protected files
            aren’t processed yet. We do not store documents after delivery; anonymized
            usage metadata may be retained for analytics (opt-out on Pro).
          </p>
        </div>
      </section>
    </main>
  );
}

function PlanCard({
  title,
  price,
  cadence,
  badge,
  highlight,
  features,
  ctaHref,
  ctaLabel,
  footer,
}: Plan) {
  return (
    <div
      className={[
        "rounded-2xl border p-6 shadow-sm bg-white",
        highlight ? "border-indigo-200 ring-1 ring-indigo-200 bg-indigo-50/50" : "border-slate-200",
      ].join(" ")}
    >
      {badge ? (
        <div className="mb-3 inline-block rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </div>
      ) : null}

      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>

      <div className="mt-2">
        <div className="text-5xl font-extrabold tracking-tight text-slate-900">{price}</div>
        <div className="text-sm text-slate-500">{cadence}</div>
      </div>

      <div className="mt-5">
        <Link
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          {ctaLabel}
        </Link>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-slate-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start">
            <span className="mr-2 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              ✓
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {footer ? (
        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
