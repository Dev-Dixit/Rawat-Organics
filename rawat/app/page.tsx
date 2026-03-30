import { HeroSection } from "@/components/hero/HeroSection";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { NewsletterCtaSection } from "@/components/sections/NewsletterCtaSection";
import { StorySection } from "@/components/sections/StorySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <CollectionSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <NewsletterCtaSection />
    </>
  );
}
