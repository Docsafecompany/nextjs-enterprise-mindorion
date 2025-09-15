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

export const dynamic = 'force-dynamic';
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
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

