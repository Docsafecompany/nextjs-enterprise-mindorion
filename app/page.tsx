import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

export default function Page() {
  return (
    <>
      <Hero />
      <section className="mx-auto mt-8 max-w-7xl px-5 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <ProductCard
            title="DocSafe"
            description="Correct & rephrase PDF, Word, and PowerPoint without breaking layout."
            href="/products/docsafe"
          />
          <ProductCard
            title="ProspectIQ"
            description="(Teaser) Contextual, industry-tailored outreach at scale."
            href="/products"
          />
         <ProductCard
  title="Industry Packs"
  description="(Teaser) Specialized templates & automations for your domain."
  href="/solutions/industry-packs"   // ← THIS
/>

        </div>

        {/* CTA banner */}
        <div className="mt-16 rounded-2xl bg-black p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Start with DocSafe today</h2>
          <p className="mt-2 opacity-90">Beta free. No signup required. Try it and share your feedback.</p>
          <a
            href="/products/docsafe"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Try DocSafe
          </a>
        </div>
      </section>
    </>
  );
}
