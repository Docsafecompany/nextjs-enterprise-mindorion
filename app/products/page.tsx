export default function Page(){
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Nos produits</h1>
      <p className="mt-3 text-slate-600">Chaque outil Mindorion résout un problème précis avec un ROI rapide.</p>
      <ul className="mt-8 list-disc pl-6 space-y-2">
        <li><a className="text-indigo-600 underline" href="/products/docsafe">DocSafe</a> — Qualité documentaire par l’IA.</li>
        <li>ProspectIQ (Teaser) — Prospection intelligente.</li>
        <li>Industry Packs (Teaser) — Outils par industrie.</li>
      </ul>
    </div>
  );
}
