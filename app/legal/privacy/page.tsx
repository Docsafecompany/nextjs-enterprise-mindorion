export const metadata = {
  title: "Privacy | Mindorion",
  description: "Privacy Policy for Mindorion products and beta programs.",
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p className="mt-4 text-slate-700">
        We collect the minimum data required to operate our products and beta
        programs. We do not sell your data. During beta, some features may rely
        on third-party providers (e.g., hosting, analytics, transactional email).
      </p>

      <h2 className="mt-8 text-xl font-semibold">What we collect</h2>
      <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-2">
        <li>
          <strong>Product usage</strong> (events, timestamps, basic device/region)
          to improve reliability and prioritize roadmap.
        </li>
        <li>
          <strong>Beta feedback</strong> you submit (forms, comments, sample docs you
          explicitly share for testing).
        </li>
        <li>
          <strong>Contact info</strong> (name, email) if you reach out to us or sign up
          for updates.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Documents & content</h2>
      <p className="mt-3 text-slate-700">
        For products like DocSafe, your files are processed to generate the
        requested output (e.g., correction/rephrasing). We keep processing
        artifacts only as long as needed to complete the operation and troubleshoot
        errors, then purge them on a scheduled basis. Do not upload content you
        are not authorized to share.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Data retention</h2>
      <p className="mt-3 text-slate-700">
        Beta logs and submissions are retained for short periods to monitor
        performance and improve quality, then deleted. You may request deletion
        of personal data by contacting us (see below).
      </p>

      <h2 className="mt-8 text-xl font-semibold">Processors & transfers</h2>
      <p className="mt-3 text-slate-700">
        We use reputable infrastructure and analytics providers. Data may be
        processed in the US and the EU. Contractual safeguards (e.g., DPAs, SCCs)
        are used where applicable.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Your rights</h2>
      <p className="mt-3 text-slate-700">
        Depending on your jurisdiction, you may have rights to access, correct,
        export, or delete your personal data. Contact us to exercise these rights.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-3 text-slate-700">
        Email: <a className="text-indigo-600 underline" href="mailto:privacy@mindorion.com">privacy@mindorion.com</a>
      </p>

      <p className="mt-8 text-sm text-slate-500">
        This page describes our beta-stage practices and will be updated as we
        expand features and jurisdictions.
      </p>
    </div>
  );
}
