"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm">
      {/* Logo + Texte */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/logo-mindorion.png"
          alt="Mindorion logo"
          className="h-8 w-auto"
        />
        <span className="text-lg font-semibold text-slate-900">Mindorion</span>
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-6">
        <Link href="/products" className="text-slate-700 hover:text-slate-900">
          Products
        </Link>
        <Link href="/about" className="text-slate-700 hover:text-slate-900">
          About Us
        </Link>
        <Link href="/pricing" className="text-slate-700 hover:text-slate-900">
          Pricing
        </Link>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link
            href="/sign-in"
            className="text-sm text-slate-700 hover:text-slate-900"
          >
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
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}

