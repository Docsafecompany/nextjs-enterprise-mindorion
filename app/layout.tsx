export const metadata = {
  title: "Mindorion",
  description: "A pragmatic AI software suite for professionals.",
};

import "../styles/tailwind.css";
// If your boilerplate uses a different global path, keep its original import instead.
// Example: import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
