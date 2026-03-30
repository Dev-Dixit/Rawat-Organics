import Image from "next/image";
import Link from "next/link";
import { storyContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { MaterialSymbol } from "@/components/MaterialSymbol";

export function StorySection() {
  return (
    <section id="story" className="bg-surface py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-3xl shadow-editorial">
              <Image
                src={storyContent.primaryImage}
                alt="Hands cradling rich organic soil with small green sprouts"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <div className="absolute -right-12 -bottom-12 z-20 hidden aspect-square w-2/3 overflow-hidden rounded-3xl border-8 border-surface shadow-editorial md:block">
              <Image
                src={storyContent.secondaryImage}
                alt="Heritage grains and seeds arranged in a botanical pattern"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 28vw"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-12">
            <span className="mb-6 block font-headline text-sm font-bold uppercase tracking-[0.2em] text-secondary">
              {storyContent.eyebrow}
            </span>
            <h2 className="mb-8 font-headline text-4xl font-extrabold leading-tight text-primary md:text-6xl">
              {storyContent.title} <br />
              <span className="font-light italic">{storyContent.titleItalic}</span>
            </h2>
            <div className="max-w-xl space-y-6 text-lg leading-relaxed text-on-surface/80">
              {storyContent.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="pt-8">
                <Link
                  href="#collection"
                  className="inline-flex items-center gap-3 border-b-2 border-primary pb-1 font-headline font-bold text-primary transition-all hover:gap-5"
                >
                  Discover Our Heritage <MaterialSymbol name="arrow_forward" className="text-xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
