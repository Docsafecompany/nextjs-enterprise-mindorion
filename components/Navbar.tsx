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

type MenuKey = "products" | null;

export default function Navbar() {
  const [open, setOpen] = useState<MenuKey>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const toggle = (key: Exclude<MenuKey, null>) =>
    setOpen((cur) => (cur === key ? null : key));

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div
        ref={wrapperRef}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
      >
<<<<<<< HEAD
        {/* LEFT: Logo + main nav */}
        <div className="flex items-center gap-8">
          {/* Logo (PLUS GRAND) */}
=======
        {/* LEFT: Logo + nav */}
        <div className="flex items-center gap-8">
>>>>>>> 3700fc9 (Update Navbar.tsx)
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-mindorion.png"
              alt="Mindorion"
<<<<<<< HEAD
              className="h-14 w-auto sm:h-16 md:h-20"  /* ← taille augmentée */
=======
              className="h-16 w-auto sm:h-20"   // ← Logo agrandi
>>>>>>> 3700fc9 (Update Navbar.tsx)
            />
          </Link>

          <nav className="relative hidden items-center gap-2 text-[16px] text-slate-700 md:flex">
            {/* PRODUCTS dropdown */}
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
                      href="/products/prospectiq"
                      title="ProspectIQ (teaser)"
                      desc="Contextual, industry-tailored outreach at scale."
                    />
                    <DropdownItem
                      href="/products/industry-packs"
                      title="Industry Packs (teaser)"
                      desc="Specialized templates & automations for your domain."
                    />
                    <DropdownItem
                      href="/beta"
                      title="Join the Beta"
                      desc="Try features early and share feedback."
                    />
                  </div>
                </div>
              )}
            </div>

<<<<<<< HEAD
            {/* ABOUT US */}
=======
>>>>>>> 3700fc9 (Update Navbar.tsx)
            <Link href="/about" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              About Us
            </Link>

<<<<<<< HEAD
            {/* PRICING */}
=======
>>>>>>> 3700fc9 (Update Navbar.tsx)
            <Link href="/pricing" className="rounded-lg px-3 py-2 hover:bg-slate-50">
              Pricing
            </Link>
          </nav>
        </div>

<<<<<<< HEAD
        {/* RIGHT: Log in + gros bouton Sign up (remplace Contact sales + Get started) */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/sign-in" className="text-[15px] text-slate-700 hover:text-slate-900">
            Log in
          </Link>

          {/* GROS bouton noir Sign up */}
          <Link
            href="/sign-up"
            className="rounded-xl bg-black px-5 py-2.5 text-[15px] font-semibold text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden">
          <Link
            href="/sign-up"
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Sign up
          </Link>
        </div>
=======
        {/* RIGHT: auth actions */}
        <div className="hidden items-center gap-4 md:flex">
          <SignedOut>
            <Link href="/sign-in" className="text-[15px] text-slate-700 hover:text-slate-900">
              Login
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-black px-5 py-2.5 text-[15px] font-semibold text-white hover:opacity-90"
            >
              Sign up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
>>>>>>> 3700fc9 (Update Navbar.tsx)
      </div>
    </header>
  );
}

<<<<<<< HEAD
/** Item de menu du dropdown Products */
=======
>>>>>>> 3700fc9 (Update Navbar.tsx)
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
    <Link href={href} className="group block rounded-xl p-3 hover:bg-slate-50">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-0.5 text-sm text-slate-600">{desc}</p>
    </Link>
  );
}

