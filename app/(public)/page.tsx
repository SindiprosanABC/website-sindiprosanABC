import { AboutUs } from "@/components/sections/about-us";
import { AttentionCTA } from "@/components/sections/attention-cta";
import { CallToAction } from "@/components/sections/call-to-action";
import { CollectiveAgreement } from "@/components/sections/collective-agreement";
import { ContactForm } from "@/components/sections/contactForm";
import { EducationalPrograms } from "@/components/sections/educacional-programs";
import { Hero } from "@/components/sections/hero";
import { LatestNews } from "@/components/sections/latestNews";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Stats />
      <AttentionCTA />
      <EducationalPrograms />
      <AboutUs />
      <CollectiveAgreement />
      {/* <LatestNews /> */}
      <ContactForm />
      <CallToAction />
    </main>
  );
}
