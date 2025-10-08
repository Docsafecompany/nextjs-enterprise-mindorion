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
    title: "Free",
    price: "€0",
    cadence: "forever",
    features: [
      "1 user",
      "Access to DocSafe V1 (metadata cleaning, grammar, spelling, punctuation)",
      "Layout preserved (PDF, DOCX, PPTX)",
      "Clean and download processed file",
      "Light quotas (e.g. 100 pages/day, 500 pages/month)",
      "Community support",
      "“Powered by DocSafe” watermark",
    ],
    ctaHref: "/products/docsafe",
    ctaLabel: "Try for Free",
    footer: "Perfect for testing DocSafe",
  },
  {
    title: "Starter",
    price: "€9.90",
    cadence: "per month",
    highlight: true,
    features: [
      "1 user",
      "Everything in Free",
      "Access to DocSafe V2 (AI rephrase, clarity, tone)",
      "Priority processing (faster jobs)",
      "Extended quotas (e.g. 2,000 pages/month, 150 MB/file)",
      "Remove “Powered by” + add your own logo",
      "Early access to upcoming features (auto-summary, AI settings, glossary)",
      "Email support (24–48h)",
    ],
    ctaHref: "/sign-up?plan=starter",
    ctaLabel: "Subscribe",
    footer: "Best for freelancers & students",
  },
  {
    title: "Pro",
    price: "€24.90",
    cadence: "per month",
    features: [
      "Up to 5 users included",
      "Everything in Starter",
      "High quotas (e.g. 25,000 pages/month, 300 MB/file)",
      "Shared folders and team spaces",
      "Branding options (logo, shared subdomain)",
      "Priority support (<24h)",
    ],
    ctaHref: "/sign-up?plan=pro",
    ctaLabel: "Subscribe",
    footer: "Ideal for small teams & startups",
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
          Clean, correct, and rephrase documents — with layout perfectly preserved.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.title} {...p} />
          ))}
        </div>

        {/* Enterprise / Contact */}
        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Need an Enterprise plan?
              </h3>
              <p className="mt-2 text-slate-600">
                API integration, custom quotas, onboarding & training, dedicated hosting (EU/US),
                SLA, and premium support — tailor-made for your company.
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Contact form
                </Link>
                <a
                  href="mailto:contact@mindorion.com?subject=Enterprise%20Contact%20-%20Mindorion"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mx-auto mt-8 max-w-4xl text-xs leading-relaxed text-slate-500">
          <p>
            <strong>Notes.</strong> “Pages” represent the total extracted text before AI processing.
            Multi-layer PDFs may increase logical page counts. Password-protected files are not yet
            supported. We do not store any documents after delivery; anonymized metadata may be kept
            for analytics purposes (opt-out available in Pro).
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

