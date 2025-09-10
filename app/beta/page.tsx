export default function BetaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Rejoindre la bêta Mindorion</h1>
      <p className="mt-3 text-slate-600">Aidez-nous à finaliser DocSafe. 5 minutes suffisent.</p>
      <div className="mt-8">
        <iframe
          src="https://tally.so/r/XXXXXXXX"  // remplace par ton lien Tally/Typeform
          width="100%" height="600" frameBorder="0" title="Beta feedback"
        />
      </div>
    </div>
  );
}
