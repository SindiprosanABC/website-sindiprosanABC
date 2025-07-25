import { AboutUs } from "@/components/sections/about-us";
import { AttentionCTA } from "@/components/sections/attention-cta";
import { CallToAction } from "@/components/sections/call-to-action";
import { CollectiveAgreement } from "@/components/sections/collective-agreement";
import { ContactForm } from "@/components/sections/contactForm";
import { EducationalPrograms } from "@/components/sections/educacional-programs";
import { Hero } from "@/components/sections/hero";
import { VacanciesJobs } from "@/components/sections/jobs-vacancies";
import { LatestNews } from "@/components/sections/latestNews";
import { MemberBenefits } from "@/components/sections/memberBenefits";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  const URL = process.env.API_URL;

  return (
    <main className="">
      <Hero />
      <Stats />
      <MemberBenefits />
      <VacanciesJobs />
      <AttentionCTA />
      <EducationalPrograms />
      <AboutUs />
      <CollectiveAgreement />
      <LatestNews />
      <ContactForm URL={URL} />
      <CallToAction />
    </main>
  );
}
