import { AboutUs } from "@/components/sections/about-us";
import { CallToAction } from "@/components/sections/call-to-action";
import { ContactForm } from "@/components/sections/contactForm";
import { EducationalPrograms } from "@/components/sections/educacional-programs";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { VacanciesJobs } from "@/components/sections/jobs-vacancies";
import { LatestNews } from "@/components/sections/latestNews";
import { MemberBenefits } from "@/components/sections/memberBenefits";
import { Stats } from "@/components/sections/stats";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Stats />
      <MemberBenefits />
      <VacanciesJobs />
      <EducationalPrograms />
      <AboutUs />
      <LatestNews />
      <ContactForm />
      <CallToAction />
      <Footer />
    </main>
  );
}
