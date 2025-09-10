export default function Page(){
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">DocSafe — Corrigez & reformulez</h1>
      <p className="mt-3 text-slate-600">PDF, DOCX, PPTX. V1 : correction. V2 : reformulation. Mise en forme conservée.</p>
      <div className="mt-6 flex gap-3">
        <a href="https://TON_URL_DOCSAFE" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white">Tester gratuitement</a>
        <a href="/beta" className="rounded-xl border px-5 py-2.5">Laisser un feedback</a>
      </div>
      <h2 className="mt-10 text-xl font-semibold">FAQ</h2>
      <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-700">
        <li>Stockage : minimum nécessaire pour exécuter la requête (MVP).</li>
        <li>Confidentialité : utilisez à votre discrétion; options Entreprise arrivent.</li>
      </ul>
    </div>
  );
}
