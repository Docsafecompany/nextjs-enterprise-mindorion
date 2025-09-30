import Link from "next/link";

export default function ProductCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500"
      >
        Learn more →
      </Link>
    </div>
  );
}
