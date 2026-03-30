import { whyChooseItems } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { MaterialSymbol } from "@/components/MaterialSymbol";

export function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-32 text-on-primary">
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="grid h-full w-full grid-cols-6">
          <div className="border-r border-on-primary" />
          <div className="border-r border-on-primary" />
          <div className="border-r border-on-primary" />
          <div className="border-r border-on-primary" />
          <div className="border-r border-on-primary" />
          <div />
        </div>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {whyChooseItems.map((item) => (
            <div key={item.title} className="group flex flex-col items-start space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container transition-transform duration-500 group-hover:rotate-12">
                <MaterialSymbol name={item.icon} className="text-4xl" aria-hidden />
              </div>
              <h4 className="font-headline text-2xl font-bold">{item.title}</h4>
              <p className="leading-relaxed text-on-primary/60">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
