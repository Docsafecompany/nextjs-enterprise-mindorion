"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Détecte si la clé Clerk est présente (sera inlinée au build)
const hasClerk =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Composant fallback quand Clerk n'est pas configuré
function FallbackAuth() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/sign-in" className="text-sm text-slate-700 hover:underline">
        Log in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-xl bg-black px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Sign up
      </Link>
    </div>
  );
}

// Charge les composants Clerk côté client uniquement si hasClerk = true
const ClerkBlock = hasClerk
  ? dynamic(async () => {
      const mod = await import("@clerk/nextjs");
      const SignedIn = mod.SignedIn;
      const SignedOut = mod.SignedOut;
      const UserButton = mod.UserButton;

      const C = () => (
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm text-slate-700 hover:underline"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-black px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      );
      return C;
    }, { ssr: false })
  : null;

export default function Navbar() {
  // Même si la clé change entre envs, on fige le choix au build
  const authUi = useMemo(() => {
    if (hasClerk && ClerkBlock) return <ClerkBlock />;
    return <FallbackAuth />;
  }, []);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img
            src="/assets/logo-mindorion.svg"
            alt="Mindorion"
            className="h-6 w-6"
          />
          Mindorion
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <div className="relative group">
            <button className="hover:underline">Products</button>
            {/* … ton menu déroulant, inchangé … */}
          </div>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
        </nav>

        {authUi}
      </div>
    </header>
  );
}
