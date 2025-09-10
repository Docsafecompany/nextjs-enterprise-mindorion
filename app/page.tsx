import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Hero />
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <ProductCard
          title="DocSafe"
          description="Correct & rephrase PDF, Word, and PowerPoint without breaking the layout."
          href="/products/docsafe"
        />
        <ProductCard
          title="ProspectIQ"
          description="(Teaser) Industry-tailored, contextual outreach."
          href="/products"
        />
        <ProductCard
          title="Industry Packs"
          description="(Teaser) Templates & automations for your domain."
          href="/solutions"
        />
      </section>
    </div>
  );
}
