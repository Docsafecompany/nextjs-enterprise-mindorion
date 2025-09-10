import Link from "next/link";

export default function Hero(){
  return (
    <section className="rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 p-[1px]">
      <div className="rounded-3xl bg-white p-10 md:p-14">
        <h1 className="text-3xl font-bold md:text-5xl">La suite d’IA pragmatique pour les pros.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Des outils concrets, adoptés en minutes, qui améliorent votre qualité d’exécution. Premier produit : DocSafe.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/products/docsafe" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white">
            Découvrir DocSafe
          </Link>
          <Link href="/beta" className="rounded-xl border px-5 py-2.5">Rejoindre la bêta</Link>
        </div>
      </div>
    </section>
  );
}
