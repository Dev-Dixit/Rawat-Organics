import { collectionItems } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CollectionCard } from "@/components/sections/CollectionCard";

export function CollectionSection() {
  return (
    <section id="collection" className="bg-surface-container-low py-24">
      <Container>
        <SectionHeading title="Curated Collections" align="center" showDivider />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {collectionItems.map((item) => (
            <CollectionCard
              key={item.title}
              title={item.title}
              description={item.description}
              imageSrc={item.image}
              imageAlt={item.title}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
