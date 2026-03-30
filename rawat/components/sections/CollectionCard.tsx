import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";

export type CollectionCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export function CollectionCard({ title, description, imageSrc, imageAlt }: CollectionCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-editorial">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-10">
        <h3 className="mb-4 font-headline text-3xl font-bold text-primary">{title}</h3>
        <p className="mb-8 leading-relaxed text-on-surface/70">{description}</p>
        <PillButton variant="primary-container" size="md">
          Learn More
        </PillButton>
      </div>
    </article>
  );
}
