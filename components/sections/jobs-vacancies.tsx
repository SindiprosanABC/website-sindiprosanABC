import { Building, Clock, ExternalLink, LocationEditIcon } from "lucide-react";
import Link from "next/link";

export const VacanciesJobs = () => {
  return (
    <section id="education" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#2e4b89]">Vagas</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Explore as principais vagas em aberto das principais empresas do
            setor na região Baixada Santista e ABC.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Job Vacancy 1 - Keeping the first card as reference */}
          <a
            href="https://www.jobatus.com.br/vaga-emprego/propagandista-litoral-sul-sp-527016135?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
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
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Junior (Santos e Região)
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Laboratório Cristália</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Santos, SP • via Glassdoor</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado há 30 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <Link href="https://laboratoriocristalia.pandape.infojobs.com.br/Detail/2234944?ov=5&xtor=AL-366332663&source=Indeed&utm_source=indeed&utm_medium=referral&utm_campaign=feed&utm_term=organic&utm_content=ats&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic">
                  <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                    Ver detalhes <ExternalLink className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </a>

          {/* Job Vacancy 2 - PROPAGANDISTA VENDEDOR JR - EMS PRESCRICAO */}
          <a
            href="https://www.linkedin.com/jobs/view/propagandista-vendedor-jr-ems-prescricao-praia-grande-sp-30032-at-ems-4258728769/?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic&originalSubdomain=br"
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
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                PROPAGANDISTA VENDEDOR JR - EMS PRESCRICAO - PRAIA GRANDE/SP
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Grupo NC</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Santos, SP • via Izirh</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado 10 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 3 - Propagandista Vendedor Junior - Baixada Santista */}
          <a
            href="https://br.whatjobs.com/gfj/314476671?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Vendedor Junior - Baixada Santista/SP
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>MEGALABS BRASIL</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Santos, SP</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado 13 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 4 - Propagandista Regional - Santos */}
          <a
            href="https://br.whatjobs.com/gfj/314476671?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Regional - Santos
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>FEMME - LABORATÓRIO DA MULHER</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Santos, SP</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado 22 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 5 - Propagandista Vendedor Junior */}
          <a
            href="https://br.trabajo.org/emprego-1215-0659143770e40a8677b2f2e3f2f0bff0?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
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
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Vendedor Junior
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>MEGALABS BRASIL</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Santos, SP</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado 12 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 6 - Modelo - Propagandista Vendodor(a) */}
          <a
            href="https://br.whatjobs.com/gfj/313814879?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Modelo - Propagandista Vendodor(a)
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Momenta</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Santos, SP</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado 13 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 7 - Propagandista Júnior */}
          <a
            href="https://br.whatjobs.com/gfj/316724577?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
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
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Júnior
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>Diffucap Chemobras</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>Mauá, Ribeirão Pires e Santo André, SP</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado recentemente</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 8 - Propagandista Vendedor Junior */}
          <a
            href="https://br.trabajo.org/emprego-3315-254c552fae67245d9c90af9c74aa7740?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4">
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Vendedor Junior
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>MEGALABS BRASIL</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>São Bernardo do Campo, SP • Divisão Especialidades</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado recentemente</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Job Vacancy 9 - Propagandista Vendedor Jr */}
          <a
            href="https://jobs.consulteportal.com.br/vaga/propagandista-vendedor-jr-ems-prescricao-sao-bernardo-do-campo-sp-ems-pharma/?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"
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
                <div className="w-24 rounded-2xl bg-[#2e4b89]/10 px-3 py-1 text-[#2e4b89] hover:bg-[#2e4b89]/20">
                  Full Time
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#2e4b89] transition-colors group-hover:text-[#d29531]">
                Propagandista Vendedor Jr
              </h3>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-[#d29531]" />
                <span>EMS Pharma</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-gray-600">
                <LocationEditIcon className="h-4 w-4 text-[#d29531]" />
                <span>São Bernardo do Campo, SP • EMS Prescrição</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[#d29531]" />
                <span>Postado 10 dias</span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#d29531] group-hover:underline">
                  Ver detalhes <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
