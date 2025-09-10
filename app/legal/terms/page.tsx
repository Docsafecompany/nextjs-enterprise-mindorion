export const metadata = {
  title: "Terms of Use | Mindorion",
  description: "Terms governing the use of Mindorion products and beta.",
};

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Terms of Use</h1>

      <p className="mt-4 text-slate-700">
        By accessing Mindorion products (including beta), you agree to these
        Terms. If you are using our services on behalf of an organization,
        you represent that you have authority to bind that organization.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Acceptable use</h2>
      <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-2">
        <li>No illegal, harmful, or infringing content.</li>
        <li>No attempts to reverse engineer, attack, or overload the services.</li>
        <li>Respect third-party rights and confidentiality obligations.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Content & IP</h2>
      <p className="mt-3 text-slate-700">
        You retain ownership of your input content. Output may be subject to
        third-party model terms and applicable law. Software, trademarks, and
        site content are owned by Mindorion and its licensors.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Beta disclaimer</h2>
      <p className="mt-3 text-slate-700">
        Beta features are provided “as is” without warranties.
        Functionality may change or be discontinued. Do not rely on beta
        outputs for decisions where errors could cause harm.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Limitation of liability</h2>
      <p className="mt-3 text-slate-700">
        To the maximum extent permitted by law, Mindorion is not liable for
        indirect, incidental, special, or consequential damages. Aggregate
        liability is limited to the amounts you paid (if any) in the 3 months
        prior to the claim.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Termination</h2>
      <p className="mt-3 text-slate-700">
        We may suspend or terminate access for violations or security reasons.
        You may stop using the services at any time.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Governing law</h2>
      <p className="mt-3 text-slate-700">
        These Terms are governed by the laws of your applicable domicile unless
        otherwise required. Disputes will be resolved in the competent courts of
        that jurisdiction.
      </p>

      <p className="mt-8 text-sm text-slate-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
