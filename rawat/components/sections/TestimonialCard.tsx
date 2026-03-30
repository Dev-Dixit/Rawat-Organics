import { MaterialSymbol } from "@/components/MaterialSymbol";

export type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
};

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-[2.5rem] bg-surface-container p-10 transition-colors hover:bg-surface-container-high">
      <div>
        <div className="mb-8 flex text-secondary" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <MaterialSymbol key={i} name="star" className="text-2xl" filled />
          ))}
        </div>
        <p className="mb-8 font-body text-xl italic leading-relaxed text-primary">&ldquo;{quote}&rdquo;</p>
      </div>
      <div>
        <p className="font-headline font-bold text-primary">{name}</p>
        <p className="text-sm text-on-surface/50">{role}</p>
      </div>
    </article>
  );
}
