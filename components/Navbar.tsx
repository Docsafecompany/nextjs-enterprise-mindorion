"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [openMega, setOpenMega] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ESC ferme tout
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMega(false);
        setOpenMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Ferme le menu mobile en repassant desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpenMobile(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMega(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMega(false), 250);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 md:py-5">
        {/* LEFT: logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/logo-mindorion.png"
              alt="Mindorion"
              className="h-9 w-auto md:h-34 lg:h-36 object-contain shrink-0"
            />
          </Link>
        </div>

        {/* CENTER: nav desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Products (mega) */}
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
              aria-expanded={openMega}
            >
              Products <span className={`transition ${openMega ? "rotate-180" : ""}`}>▾</span>
            </button>

            {openMega && (
              <div
                className="absolute left-0 mt-3 w-[560px] rounded-2xl border bg-white p-6 shadow-xl"
                role="menu"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* DocSafe */}
                  <Link href="/products/docsafe" className="block group" role="menuitem">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                      DocSafe
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Correct & rephrase PDF, Word & PowerPoint without breaking layout.
                    </p>
                  </Link>

                  {/* Industry Packs (teaser) */}
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

                  {/* ProspectIQ (teaser) */}
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

          <Link href="/about" className="text-slate-800 hover:text-indigo-600">
            About Us
          </Link>
          <Link href="/pricing" className="text-slate-800 hover:text-indigo-600">
            Pricing
          </Link>
        </nav>

        {/* RIGHT: auth desktop */}
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
              appearance={{ elements: { userButtonPopoverCard: "shadow-2xl border rounded-2xl" } }}
            />
          </SignedIn>
        </div>

        {/* MOBILE: hamburger */}
        <button
          aria-label="Open menu"
          aria-expanded={openMobile}
          onClick={() => setOpenMobile((v) => !v)}
          className="inline-flex items-center rounded-md border px-3 py-2 text-slate-700 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* MOBILE panel */}
      <div
        className={`md:hidden overflow-hidden border-t transition-[max-height,opacity] duration-300 ease-out ${
          openMobile ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 py-3">
          <Link
            onClick={() => setOpenMobile(false)}
            href="/products"
            className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-50"
          >
            Products
          </Link>
          <Link
            onClick={() => setOpenMobile(false)}
            href="/about"
            className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-50"
          >
            About Us
          </Link>
          <Link
            onClick={() => setOpenMobile(false)}
            href="/pricing"
            className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-50"
          >
            Pricing
          </Link>

          <div className="my-2 h-px bg-slate-200" />

          <SignedOut>
            <Link
              onClick={() => setOpenMobile(false)}
              href="/sign-in"
              className="block rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-50"
            >
              Log in
            </Link>
            <Link
              onClick={() => setOpenMobile(false)}
              href="/sign-up"
              className="block rounded-lg bg-slate-900 px-3 py-2 text-center font-semibold text-white hover:opacity-90"
            >
              Sign up
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="px-3 py-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { userButtonPopoverCard: "shadow-2xl border rounded-2xl" } }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

