export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-5 py-4 md:px-10">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <span className="font-serif text-lg text-gold-800">Universal Key</span>
        <nav className="flex gap-6 text-xs text-ink-soft">
          <a href="#" className="transition-colors hover:text-gold-700">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-gold-700">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-gold-700">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
