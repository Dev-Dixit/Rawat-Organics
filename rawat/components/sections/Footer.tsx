"use client";

import Link from "next/link";
import { footerContent } from "@/content/site";
import { MaterialSymbol } from "@/components/MaterialSymbol";

export function Footer() {
  return (
    <footer className="mt-20 w-full rounded-t-3xl bg-primary text-on-primary dark:bg-zinc-950">
      <div className="grid w-full grid-cols-1 gap-12 px-12 py-24 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <div className="font-headline text-2xl font-black text-white">Rawat Organics</div>
          <p className="font-body text-sm leading-relaxed tracking-wide text-white/70">
            {footerContent.tagline}
          </p>
        </div>

        <div className="space-y-6">
          <h5 className="text-xs font-bold tracking-widest text-white uppercase">Explore</h5>
          <ul className="space-y-4">
            {footerContent.explore.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="inline-block text-white/70 transition-transform hover:translate-x-1 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-xs font-bold tracking-widest text-white uppercase">Connect</h5>
          <ul className="space-y-4">
            {footerContent.connect.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="inline-block text-white/70 transition-transform hover:translate-x-1 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-xs font-bold tracking-widest text-white uppercase">Atelier Location</h5>
          <p className="font-body text-sm leading-relaxed text-white/70">
            {footerContent.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-12 py-8 font-body text-xs text-white/50 sm:flex-row">
        <span>© {new Date().getFullYear()} Rawat Organics. Cultivating Essence.</span>
        <button
          type="button"
          className="flex items-center gap-2 transition-colors hover:text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top <MaterialSymbol name="arrow_upward" className="text-sm" />
        </button>
      </div>
    </footer>
  );
}
