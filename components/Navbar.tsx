"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// Clerk (avatar/menu when signed in)
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 250); // grace period to cross the gap
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* LEFT: logo + nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/logo-mindorion.png" /* public/logo-mindorion.png */
              alt="Mindorion"
              className="h-24 w-auto"
            />
          </Link>

          {/* Primary nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {/* Products menu */}
            <div
              ref={wrapRef}
              className="relative"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-slate-800 hover:text-indigo-600"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                Products <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
              </button>

              {open && (
                <div
                  className="absolute left-0 mt-3 w-[560px] rounded-2xl border bg-white p-6 shadow-xl"
                  role="menu"
                >
                  <div className="grid grid-cols-2 gap-6">
                    {/* DocSafe (active) */}
                    <Link href="/products/docsafe" className="block group" role="menuitem">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        DocSafe
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Correct & rephrase PDF, Word & PowerPoint without breaking layout.
                      </p>
                    </Link>

                    {/* Industry Packs (disabled/teaser) */}
                    <div
                      className="block group opacity-40 cursor-not-allowed select-none"
                      aria-disabled
                      role="menuitem"
                    >
                      <div className="font-semibold text-slate-900">
                        Industry Packs{" "}
                        <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold">
                          Coming soon
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Specialized templates & automations for your domain.
                      </p>
                    </div>

                    {/* ProspectIQ (disabled/teaser) */}
                    <div
                      className="block group opacity-40 cursor-not-allowed select-none"
                      aria-disabled
                      role="menuitem"
                    >
                      <div className="font-semibold text-slate-900">
                        ProspectIQ{" "}
                        <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold">
                          Coming soon
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Contextual, industry-tailored outreach at scale.
                      </p>
                    </div>

                    {/* Join the Beta (optional link stays active) */}
                    <Link href="/beta" className="block group" role="menuitem">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                        Join the Beta
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Try features early and share feedback.
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Keep About & Pricing clickable */}
            <Link href="/about" className="text-slate-800 hover:text-indigo-600">
              About Us
            </Link>
            <Link href="/pricing" className="text-slate-800 hover:text-indigo-600">
              Pricing
            </Link>
          </nav>
        </div>

        {/* RIGHT: auth area */}
        <div className="hidden items-center gap-4 md:flex">
          <SignedOut>
            <Link href="/sign-in" className="text-sm text-slate-700 hover:text-indigo-600">
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "shadow-2xl border rounded-2xl",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

