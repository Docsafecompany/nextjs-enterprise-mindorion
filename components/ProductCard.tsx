import Link from "next/link";
export default function ProductCard(
  { title, description, href }: { title:string; description:string; href:string }
){
  return (
    <Link href={href} className="group rounded-2xl border p-5 hover:shadow-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <span className="mt-4 inline-block text-sm text-indigo-600 group-hover:underline">
        En savoir plus →
      </span>
    </Link>
  );
}
