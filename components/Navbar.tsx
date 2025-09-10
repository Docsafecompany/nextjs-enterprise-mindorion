"use client";

import Link from "next/link";
import { useState } from "react";

function Caret() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="ml-1 inline-block"
    >
      <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
  <img
    src="/logo-mindorion.svg"
    alt="Mindorion"
    className="h-16 w-auto sm:h-20 md:h-24"
  />
</Link>

        {/* Middle: Menu */}
        <nav className="hidden items-center gap-6 text-[15px] text-slate-700 md:flex">
          <button
            className="hover:text-slate-900"
            onMouseEnter={() => setOpen("products")}
            onMouseLeave={() => setOpen(null)}
          >
            Products <Caret />
          </button>
          <button
            className="hover:text-slate-900"
            onMouseEnter={() => setOpen("solutions")}
            onMouseLeave={() => setOpen(null)}
          >
            Solutions <Caret />
          </button>
          <button
            className="hover:text-slate-900"
            onMouseEnter={() => setOpen("community")}
            onMouseLeave={() => setOpen(null)}
          >
            Community <Caret />
          </button>
          <button
            className="hover:text-slate-900"
            onMouseEnter={() => setOpen("resources")}
            onMouseLeave={() => setOpen(null)}
          >
            Resources <Caret />
          </button>
          <Link href="/pricing" className="hover:text-slate-900">
            Pricing
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-[15px] text-slate-700 hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 px-3.5 py-2 text-[15px] font-medium hover:bg-slate-50"
          >
            Contact sales
          </Link>
          <Link
            href="/products/docsafe"
            className="rounded-xl bg-black px-3.5 py-2 text-[15px] font-semibold text-white hover:opacity-90"
          >
            Get started for free
          </Link>
        </div>

        {/* Mobile burger (just show CTA) */}
        <div className="md:hidden">
          <Link
            href="/products/docsafe"
            className="rounded-xl bg-black px-3.5 py-2 text-sm font-semibold text-white"
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Dropdown placeholder */}
      {open && (
        <div
          onMouseEnter={() => setOpen(open)}
          onMouseLeave={() => setOpen(null)}
          className="border-b bg-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-4 text-sm text-slate-600">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="font-medium text-slate-900 capitalize">{open}</p>
                <p className="mt-1">
                  Curated links coming soon. (Static placeholder)
                </p>
              </div>
              <div>
                <a
                  className="text-indigo-600 hover:underline"
                  href="/products/docsafe"
                >
                  DocSafe
                </a>
              </div>
              <div>
                <a className="text-indigo-600 hover:underline" href="/beta">
                  Join the beta
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

