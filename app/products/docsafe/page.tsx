export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">DocSafe — Correct & Rephrase</h1>
      <p className="mt-3 text-slate-600">
        PDF, DOCX, PPTX. V1: grammar & spelling. V2: style & clarity. Layout preserved.
      </p>
      <div className="mt-6 flex gap-3">
        <a href="https://nextjs-boilerplate-mocha-rho-16.vercel.app" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white">
          Try it free
        </a>
        <a href="/beta" className="rounded-xl border px-5 py-2.5">
          Leave feedback
        </a>
      </div>
      <h2 className="mt-10 text-xl font-semibold">FAQ</h2>
      <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-700">
        <li>Storage: minimal data kept to process the request (beta).</li>
        <li>Confidentiality: use at your discretion; Enterprise options coming.</li>
      </ul>
    </div>
  );
}
