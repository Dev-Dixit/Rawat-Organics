import { testimonials } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { TestimonialCard } from "@/components/sections/TestimonialCard";

export function TestimonialsSection() {
  return (
    <section className="bg-surface py-32">
      <Container>
        <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div className="max-w-2xl">
            <span className="mb-4 block font-headline text-sm font-bold uppercase tracking-widest text-secondary">
              Voices
            </span>
            <h2 className="font-headline text-4xl font-extrabold text-primary md:text-5xl">
              The Conscious Voice
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-outline/30 text-on-surface transition-colors hover:bg-primary hover:text-white"
              aria-label="Previous testimonial"
            >
              <MaterialSymbol name="chevron_left" className="text-2xl" />
            </button>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-outline/30 text-on-surface transition-colors hover:bg-primary hover:text-white"
              aria-label="Next testimonial"
            >
              <MaterialSymbol name="chevron_right" className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} quote={t.quote} name={t.name} role={t.role} />
          ))}
        </div>
      </Container>
    </section>
  );
}
