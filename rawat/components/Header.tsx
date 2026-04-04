import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  active?: boolean;
};

const navLinks: NavItem[] = [
  { href: "/", label: "Home", active: true },
  { href: "#story", label: "Our Story" },
  { href: "#collection", label: "Collection" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header>
      <nav className="fixed top-0 z-50 w-full bg-surface/70 backdrop-blur-md dark:bg-zinc-950/70">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-6">
          <Link
            href="/"
            className="font-headline text-xl font-bold tracking-tighter text-primary dark:text-emerald-50"
          >
            Rawat Organic
          </Link>

          <div className="hidden items-center space-x-10 font-headline text-sm font-bold tracking-tight md:flex">
            {navLinks.map((item) =>
              item.active ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b-2 border-primary pb-1 font-bold text-primary transition-transform duration-300 hover:scale-105 dark:border-emerald-100 dark:text-emerald-100"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-primary/60 transition-colors duration-300 hover:scale-105 hover:text-primary dark:text-emerald-50/60 dark:hover:text-emerald-50"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <button
            type="button"
            className="rounded-full bg-primary-container px-6 py-2 font-headline text-sm font-bold text-on-primary-container transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Inquire
          </button>
        </div>
      </nav>
    </header>
  );
}
