"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`ml-1 inline-block transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
    </svg>
  );
}

type MenuKey = "products" | "solutions" | "community" | "resources" | null;

export default function Navbar() {
  const [open, setOpen] = useState<MenuKey>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(null);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // helper: toggle a menu by key
  const toggle = (key: Exclude<MenuKey, null>) =>
    setOpen((cur) => (cur === key ? null : key));

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div ref={wrapperRef} className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo-mindorion.svg"
            alt="Mindorion"
            className="h-24 w-auto sm:h-28 md:h-32"
          />
        </Link>

        {/* Middle: Menus */}
        <nav className="relative hidden items-center gap-2 text-[17px] text-slate-700 md:flex">
          {/* PRODUCTS */}
          <div className="relative">
            <button
              onClick={() => toggle("products")}
              className="rounded-lg px-3 py-2 hover:bg-slate-50"
              aria-haspopup="menu"
              aria-expanded={open === "products"}
            >
              Products <Caret open={open === "products"} />
            </button>

            {open === "products" && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-[560px] rounded-2xl border bg-white p-3 shadow-xl ring-1 ring-black/5"
              >
                <div className="grid grid-cols-2 gap-2">
                  <DropdownItem
                    href="/products/docsafe"
                    title="DocSafe"
                    desc="Correct & rephrase PDF, Word, and PowerPoint without breaking layout."
                  />
                 <DropdownItem
  href="/products/prospectiq"     // ← was /products; make it a real route
  title="ProspectIQ (teaser)"
  desc="Contextual, industry-tailored outreach at scale."
/>
                 <DropdownItem
  href="/products/industry-packs" // ← was /solutions; make it a real route
  title="Industry Packs (teaser)"
  desc="Specialized templates & automations for your domain."
/>
                  <DropdownItem
                    href="/beta"
                    title="Join the Beta"
                    desc="Try features early and share feedback."
                  />
                </div>
                <div className="mt-2 border-t pt-2">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center rounded-xl px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                  >
                    Pricing →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* SOLUTIONS (duplicate pattern) */}
          <div className="relative">
            <button
              onClick={() => toggle("solutions")}
              className="rounded-lg px-3 py-2 hover:bg-slate-50"
              aria-haspopup="menu"
              aria-expanded={open === "solutions"}
            >
              Solutions <Caret open={open === "solutions"} />
            </button>
            {open === "solutions" && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-[420px] rounded-2xl border bg-white p-3 shadow-xl ring-1 ring-black/5"
              >
                <DropdownItem href="/solutions" title="SMBs" desc="Lightweight tooling that ships fast." />
                <DropdownItem href="/solutions" title="Agencies" desc="Batch, review, deliver at scale." />
                <DropdownItem href="/solutions" title="Enterprises" desc="Security, audit trails, SLAs." />
              </div>
            )}
          </div>

          {/* COMMUNITY */}
          <div className="relative">
            <button
              onClick={() => toggle("community")}
              className="rounded-lg px-3 py-2 hover:bg-slate-50"
              aria-haspopup="menu"
              aria-expanded={open === "community"}
            >
              Community <Caret open={open === "community"} />
            </button>
            {open === "community" && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-[360px] rounded-2xl border bg-white p-3 shadow-xl ring-1 ring-black/5"
              >
                <DropdownItem href="/beta" title="Beta program" desc="Early access & user interviews." />
                <DropdownItem href="/changelog" title="Changelog" desc="What’s new & fixed." />
                <DropdownItem href="/blog" title="Blog" desc="Product notes & deep dives." />
              </div>
            )}
          </div>

          {/* RESOURCES */}
          <div className="relative">
            <button
              onClick={() => toggle("resources")}
              className="rounded-lg px-3 py-2 hover:bg-slate-50"
              aria-haspopup="menu"
              aria-expanded={open === "resources"}
            >
              Resources <Caret open={open === "resources"} />
            </button>
            {open === "resources" && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-[400px] rounded-2xl border bg-white p-3 shadow-xl ring-1 ring-black/5"
              >
                <DropdownItem href="/docs" title="Docs" desc="Quick start & guides." />
                <DropdownItem href="/security" title="Security" desc="Practices during beta." />
                <DropdownItem href="/legal/privacy" title="Privacy & Terms" desc="Our commitments." />
              </div>
            )}
          </div>

          <Link href="/pricing" className="rounded-lg px-3 py-2 hover:bg-slate-50">
            Pricing
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-[15px] text-slate-700 hover:text-slate-900">
            Log in
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 px-4 py-2 text-[15px] font-medium hover:bg-slate-50"
          >
            Contact sales
          </Link>
          <Link
            href="/products/docsafe"
            className="rounded-xl bg-black px-4 py-2 text-[15px] font-semibold text-white hover:opacity-90"
          >
            Get started for free
          </Link>
        </div>

        {/* Mobile: simple CTA */}
        <div className="md:hidden">
          <Link
            href="/products/docsafe"
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Small card-like item used in dropdowns */
function DropdownItem({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl p-3 hover:bg-slate-50"
    >
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-0.5 text-sm text-slate-600">{desc}</p>
    </Link>
  );
}
