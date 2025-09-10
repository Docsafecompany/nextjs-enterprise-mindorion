export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Mindorion</p>
          <nav className="flex gap-4">
            <a href="/legal/privacy">Confidentialité</a>
            <a href="/legal/terms">Conditions</a>
            <a href="/security">Sécurité</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
