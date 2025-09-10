export default function BetaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Join the Mindorion Beta</h1>
      <p className="mt-3 text-slate-600">Help us refine DocSafe. 5 minutes is enough.</p>
      <div className="mt-8">
        <iframe
          src="https://tally.so/r/XXXXXX" // replace with your Tally/Typeform link
          width="100%"
          height="600"
          frameBorder="0"
          title="Beta feedback"
        />
      </div>
    </div>
  );
}
