export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="mt-3 text-slate-600">
        Each Mindorion tool solves one concrete problem with fast, measurable ROI.
      </p>
      <ul className="mt-8 list-disc pl-6 space-y-2">
        <li><a className="text-indigo-600 underline" href="/products/docsafe">DocSafe</a> — Document quality with AI.</li>
        <li>ProspectIQ (Teaser) — Smart, personalized prospecting.</li>
        <li>Industry Packs (Teaser) — Specialized tools by industry.</li>
      </ul>
    </div>
  );
}
