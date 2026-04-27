"use client";

import { JobsListing } from "@/components/sections/jobsListing";

export default function JobsPage() {
  // const [locationFilter, setLocationFilter] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#2e4b89] py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Vagas de Emprego
            </h1>
            <p className="text-lg text-gray-200">
              Explore oportunidades exclusivas para profissionais do setor farmacêutico e da área médica, em diversas especialidades, em todo o Brasil.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-8 items-start">
            {/* <JobsFilter onRegionChange={setLocationFilter} /> */}
            <div className="flex-1 min-w-0">
              <JobsListing 
              // locationFilter={locationFilter}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
