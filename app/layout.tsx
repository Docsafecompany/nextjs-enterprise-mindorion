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

/** Expose l'URL du backend au navigateur (utilisé par DocSafeUploader) */
function BackendExposeScript() {
  const backendUrl =
    process.env.NEXT_PUBLIC_DOCSAFE_BACKEND_URL ||
    process.env.DOCSAFE_BACKEND_URL ||
    "";
  const payload = `window.__DOCSAFE_BACKEND__ = ${JSON.stringify(backendUrl)};`;
  return <script dangerouslySetInnerHTML={{ __html: payload }} />;
}

/**
 * Expose le plan utilisateur au navigateur pour activer le bouton
 * "Clean & Rephrase" côté front sans casser le build.
 *
 * Priorité :
 *  1) localStorage["plan"] (écris-le après login/checkout : "starter" | "pro" | "free")
 *  2) cookie plan=...
 *  3) défaut: "free"
 *
 * NB: Tu peux surcharger pour un test rapide :
 *   localStorage.setItem("plan","starter"); // puis reload
 */
function UserPlanExposeScript() {
  const payload = `
    (function(){
      try {
        var p = (localStorage.getItem("plan") || "").toLowerCase();
        if (!p) {
          var m = document.cookie.match(/(?:^|; )plan=([^;]+)/);
          if (m && m[1]) p = decodeURIComponent(m[1]).toLowerCase();
        }
        if (!p) p = "free";
        window.__USER_PLAN__ = p;
      } catch (e) {
        window.__USER_PLAN__ = "free";
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: payload }} />;
}

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
        <head>
          {/* Expose l'URL du backend au client */}
          <BackendExposeScript />
        </head>
        <body className="min-h-screen bg-white text-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Expose le plan utilisateur côté client (starter/pro/free) */}
          <UserPlanExposeScript />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={pk}>
      <html lang="en">
        <head>
          {/* Expose l'URL du backend au client */}
          <BackendExposeScript />
        </head>
        <body className="min-h-screen bg-white text-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Expose le plan utilisateur côté client (starter/pro/free) */}
          <UserPlanExposeScript />
        </body>
      </html>
    </ClerkProvider>
  );
}



