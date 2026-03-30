"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import { newsletterCta } from "@/content/site";
import { PillButton } from "@/components/ui/PillButton";

export function NewsletterCtaSection() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section id="contact" className="px-8 py-24">
      <div className="relative mx-auto min-h-112 w-full max-w-7xl overflow-hidden rounded-[3rem] shadow-editorial">
        <Image
          src={newsletterCta.image}
          alt="Misty forest floor with sunlight through the canopy"
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col items-center px-8 py-20 text-center">
          <h2 className="mb-6 max-w-3xl font-headline text-4xl font-extrabold text-white md:text-6xl">
            {newsletterCta.title}
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-lg text-white/70">{newsletterCta.description}</p>

          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-lg flex-col gap-4 sm:flex-row"
            noValidate
          >
            <label htmlFor="hero-email" className="sr-only">
              Email
            </label>
            <input
              id="hero-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              className="min-h-[52px] grow rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/40 transition-all focus:ring-2 focus:ring-primary-container focus:outline-none"
            />
            <PillButton type="submit" variant="white" size="md" className="shrink-0 sm:px-10">
              Subscribe
            </PillButton>
          </form>
        </div>
      </div>
    </section>
  );
}
