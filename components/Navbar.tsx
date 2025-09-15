"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo + brand */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Mindorion" className="h-8 w-8" />
          <span className="text-base font-semibold text-slate-900">Mindorion</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Products (mega menu) */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              className="inline-flex items-center gap-1 text-slate-800 hover:text-indigo-600"
              aria-haspopup="true"
              aria-expanded={open}
              onFocus={() => setOpen(true)}
              onBlur={(e) => {
                // close when focus leaves the menu
                if (!e.currentTarget.closest(":focus-within")) setOpen(false);
              }}
            >
              Products
              <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            {open && (
              <div
                className="absolute left-0 mt-3 w-[540px] rounded-2xl border bg-white p-6 shadow-xl"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Link href="/products/docsafe" className="block group">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        DocSafe
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Correct & rephrase PDF, Word, and PowerPoint without breaking layout.
                      </p>
                    </Link>

                    <Link href="/products/industry-packs" className="block group">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        Industry Packs (teaser)
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Specialized templates & automations for your domain.
                      </p>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <Link href="/products/prospectiq" className="block group">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        ProspectIQ (teaser)
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Contextual, industry-tailored outreach at scale.
                      </p>
                    </Link>

                    <Link href="/beta" className="block group">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        Join the Beta
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Try features early and share feedback.
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/about" className="text-slate-800 hover:text-indigo-600">
            About Us
          </Link>
          <Link href="/pricing" className="text-slate-800 hover:text-indigo-600">
            Pricing
          </Link>
        </nav>

        {/* Right auth actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/sign-in" className="text-sm text-slate-700 hover:text-indigo-600">
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}


