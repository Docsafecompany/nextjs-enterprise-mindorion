import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Hero />
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <ProductCard title="DocSafe" description="Corrige & reformule (PDF, Word, PowerPoint) sans casser la mise en forme." href="/products/docsafe" />
        <ProductCard title="ProspectIQ" description="(Teaser) Prospection intelligente et personnalisée par secteur." href="/products" />
        <ProductCard title="Industry Packs" description="(Teaser) Templates & automations par industrie." href="/solutions" />
      </section>
    </div>
  );
}

