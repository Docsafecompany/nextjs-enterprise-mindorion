export const metadata = {
  title: "Security | Mindorion",
  description: "Overview of Mindorion security practices during beta.",
};

export default function Security() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Security</h1>

      <h2 className="mt-6 text-xl font-semibold">Transport & storage</h2>
      <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-2">
        <li>TLS in transit for all traffic.</li>
        <li>Minimal logging; short-term retention during beta.</li>
        <li>Document processing artifacts are purged on a schedule.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Access controls</h2>
      <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-2">
        <li>Principle of least privilege for operators.</li>
        <li>Separate environments for development and production.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Dependencies & vendors</h2>
      <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-2">
        <li>Reputable cloud and email providers under DPAs where applicable.</li>
        <li>Regular updates of critical dependencies.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Responsible disclosure</h2>
      <p className="mt-3 text-slate-700">
        If you discover a vulnerability, please contact{" "}
        <a className="text-indigo-600 underline" href="mailto:security@mindorion.com">
          security@mindorion.com
        </a>. We appreciate coordinated disclosure.
      </p>
    </div>
  );
}
