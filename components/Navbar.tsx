import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Mindorion</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/products">Produits</Link>
          <Link href="/beta">Bêta</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">À propos</Link>
          <Link href="/contact" className="rounded-xl border px-3 py-1.5">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
