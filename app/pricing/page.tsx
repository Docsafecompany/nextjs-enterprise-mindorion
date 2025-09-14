// app/pricing/page.tsx
import Link from "next/link";

const features = {
  free: [
    "1 user",
    "PDF, DOCX, PPTX support",
    "V1: metadata cleaning (PDF), spelling/grammar, spacing & punctuation",
    "Strict PDF option (remove hidden/invisible text)",
    "Layout preserved (Word/PowerPoint styles intact)",
    "Batch: 1 file per job, ZIP output",
    "HTML report with changes",
    "Limits: 50 MB/file, 100 pages/day, 500 pages/month, 5 jobs/day",
    "Download links valid 1h",
    "Community support",
    "“Powered by DocSafe” in report",
  ],
  starter: [
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
  pro: [
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
};

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
          {/* Free */}
          <PlanCard
            highlight={false}
            badge=""
            title="Free Plan"
            price="$0"
            cadence="forever"
            cta={<Link href="/products/docsafe" className="btn-primary">Select</Link>}
            features={features.free}
            footer="Great for trying DocSafe"
          />

          {/* Starter (highlight) */}
          <PlanCard
            highlight
            badge="30 Day Free Trial"
            title="Starter"
            price="$15"
            cadence="per month"
            cta={
              <Link href="/sign-up?plan=starter" className="btn-primary">
                Start Free Trial
              </Link>
            }
            features={features.starter}
            footer="Best for individuals"
          />

          {/* Pro */}
          <PlanCard
            highlight={false}
            badge=""
            title="Pro"
            price="$40"
            cadence="per month"
            cta={<Link href="/contact?plan=pro" className="btn-primary">Select</Link>}
            features={features.pro}
            footer="For small teams & power users"
          />
        </div>

        {/* Add-ons */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">Add-ons</h3>
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
            <strong>Notes.</strong> “Pages” count the total extracted text before AI (multi-layer PDFs
            may increase logical pages). Password-protected files aren’t processed yet. We do not store
            documents after delivery; anonymized usage metadata may be retained for analytics (opt-out on Pro).
          </p>
        </div>
      </section>

      <style jsx global>{`
        .plan {
          @apply rounded-2xl border bg-white p-6 shadow-sm;
        }
        .plan.highlight {
          @apply border-indigo-200 bg-indigo-50/50 ring-1 ring-indigo-200;
        }
        .btn-primary {
          @apply inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700;
        }
        .price {
          @apply text-5xl font-extrabold tracking-tight;
        }
        .check {
          @apply mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white;
        }
        .feature {
          @apply flex items-start;
        }
      `}</style>
    </main>
  );
}

function PlanCard({
  highlight,
  badge,
  title,
  price,
  cadence,
  features,
  cta,
  footer,
}: {
  highlight?: boolean;
  badge?: string;
  title: string;
  price: string;
  cadence: string;
  features: string[];
  cta: React.ReactNode;
  footer?: string;
}) {
  return (
    <div className={`plan ${highlight ? "highlight" : ""}`}>
      {badge ? (
        <div className="mb-3 inline-block rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </div>
      ) : null}

      <h3 className="text-2xl font-bold">{title}</h3>

      <div className="mt-2">
        <div className="price">{price}</div>
        <div className="text-sm text-slate-500">{cadence}</div>
      </div>

      <div className="mt-5">{cta}</div>

      <ul className="mt-6 space-y-2 text-sm text-slate-700">
        {features.map((f, i) => (
          <li key={i} className="feature">
            <span className="check">✓</span>
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
