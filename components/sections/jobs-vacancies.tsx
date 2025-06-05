import {
  Badge,
  Building,
  Clock,
  ExternalLink,
  LocationEditIcon,
} from "lucide-react";

export const VacanciesJobs = () => {
  return (
    <section id="education" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Badge className="mb-2 bg-[#d29531] hover:bg-[#d29531]/90">
            Career Opportunities
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-[#2e4b89]">
            Vagas no Ramo
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Explore as principais vagas em aberto das principais empresas do
            setor na região Baixada Santista e ABC.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Job Vacancy 1 */}
          <a
            href="https://www.jobatus.com.br/vaga-emprego/propagandista-litoral-sul-sp-527016135?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic
"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute top-0 right-0">
                <div className="rounded-bl-lg bg-[#d29531] px-3 py-1 text-xs font-bold text-white">
                  New
                </div>
              </div>
              <div className="mb-4">
                <Badge className="bg-[#2e4b89]/10 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </Badge>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Senior Pharmaceutical Sales Representative
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Johnson & Johnson</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Chicago, IL (Hybrid)</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Posted 2 days ago</span>
              </div>
              <p className="mb-6 flex-grow text-gray-600">
                Seeking an experienced pharmaceutical sales representative to
                promote our cardiovascular product line to healthcare providers
                in the Chicago metropolitan area.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  View Details <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 2 */}
          <a
            href="https://br.whatjobs.com/gfj/303351155?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic
"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <Badge className="bg-[#2e4b89]/10 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </Badge>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Regional Sales Manager - Pharmaceuticals
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Pfizer</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Boston, MA (On-site)</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Posted 1 week ago</span>
              </div>
              <p className="mb-6 flex-grow text-gray-600">
                Lead a team of pharmaceutical sales representatives in the
                Northeast region, developing strategies to increase market share
                for our oncology portfolio.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  View Details <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 3 */}
          <a
            href="https://br.whatjobs.com/gfj/305514700?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic
"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute top-0 right-0">
                <div className="rounded-bl-lg bg-[#2e4b89] px-3 py-1 text-xs font-bold text-white">
                  Featured
                </div>
              </div>
              <div className="mb-4">
                <Badge className="bg-[#2e4b89]/10 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Contract
                </Badge>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Pharmaceutical Sales Specialist - Diabetes
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Novo Nordisk</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Remote (US-based)</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Posted 3 days ago</span>
              </div>
              <p className="mb-6 flex-grow text-gray-600">
                Specialist role focused on promoting our innovative diabetes
                treatment solutions to endocrinologists and primary care
                physicians.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  View Details <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 4 */}
          <a
            href="https://br.whatjobs.com/gfj/305130646?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic
"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <Badge className="bg-[#2e4b89]/10 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </Badge>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Entry-Level Pharmaceutical Sales Representative
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>AstraZeneca</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Dallas, TX (Hybrid)</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Posted 5 days ago</span>
              </div>
              <p className="mb-6 flex-grow text-gray-600">
                Great opportunity for recent graduates with a science background
                to start a career in pharmaceutical sales. Comprehensive
                training provided.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  View Details <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 5 */}
          <a
            href="https://br.whatjobs.com/gfj/305263912?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic 
"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <Badge className="bg-[#2e4b89]/10 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Part Time
                </Badge>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Medical Science Liaison - Neurology
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Biogen</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>San Francisco, CA (Hybrid)</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Posted 1 week ago</span>
              </div>
              <p className="mb-6 flex-grow text-gray-600">
                Seeking a PhD or MD to serve as a scientific resource for
                healthcare providers regarding our neurology products. Strong
                scientific background required.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  View Details <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 6 */}
          <a
            href="https://br.whatjobs.com/gfj/305130646?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute top-0 right-0">
                <div className="rounded-bl-lg bg-[#d29531] px-3 py-1 text-xs font-bold text-white">
                  New
                </div>
              </div>
              <div className="mb-4">
                <Badge className="bg-[#2e4b89]/10 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </Badge>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Hospital Account Manager - Pharmaceuticals
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Merck</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Atlanta, GA (On-site)</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Posted today</span>
              </div>
              <p className="mb-6 flex-grow text-gray-600">
                Develop and maintain relationships with hospital systems to
                increase adoption of our pharmaceutical products. Experience
                with hospital formularies preferred.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  View Details <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
