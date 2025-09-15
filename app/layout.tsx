// app/layout.tsx
import type { ReactNode } from "react";
import "../styles/tailwind.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Mindorion",
  description: "A pragmatic AI software suite for professionals.",
};

// Empêche le prerender de planter si Clerk est incomplet
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Mode safe : si la clé Clerk n’est pas dispo au build → on rend sans ClerkProvider
  if (!pk) {
    if (typeof window === "undefined") {
      console.warn(
        "[Clerk] Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Rendering without ClerkProvider for build."
      );
    }
    return (
      <html lang="en">
        <body className="min-h-screen bg-white text-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={pk}>
      <html lang="en">
        <body className="min-h-screen bg-white text-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}


